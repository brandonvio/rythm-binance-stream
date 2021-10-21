import * as cdk from 'aws-cdk-lib'
import * as ecr from 'aws-cdk-lib/aws-ecr'
import * as iam from 'aws-cdk-lib/aws-iam'
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb'
import * as logs from 'aws-cdk-lib/aws-logs'
import * as ecs from 'aws-cdk-lib/aws-ecs'
import * as ec2 from 'aws-cdk-lib/aws-ec2'
import { Construct } from 'constructs'

interface FargateServiceProps {
    readonly serviceName: string
    readonly vpc: ec2.IVpc
    readonly imageTag: string
    readonly repoName: string
}

export class FargateService extends Construct {
    constructor(scope: Construct, id: string, props: FargateServiceProps) {
        super(scope, id)

        const execRole = new iam.Role(this, 'ExecRole', {
            roleName: 'rythm-exec-role',
            assumedBy: new iam.ServicePrincipal('eecs-tasks.amazonaws.com'),
        })

        execRole.addManagedPolicy(
            iam.ManagedPolicy.fromAwsManagedPolicyName(
                'AmazonDynamoDBFullAccess'
            )
        )

        const taskDef = new ecs.TaskDefinition(this, 'TaskDef', {
            compatibility: ecs.Compatibility.FARGATE,
            cpu: '256',
            memoryMiB: '512',
            executionRole: execRole,
        })

        const ecrRepo = ecr.Repository.fromRepositoryName(
            scope,
            'Repo',
            props.repoName
        )

        const containerImage = ecs.ContainerImage.fromEcrRepository(
            ecrRepo,
            props.imageTag
        )

        const logGroup = new logs.LogGroup(this, 'LogGroup', {
            logGroupName: `/rythm/ecs/${props.serviceName}-lg`,
            retention: logs.RetentionDays.FIVE_DAYS,
            removalPolicy: cdk.RemovalPolicy.DESTROY,
        })

        const container = taskDef.addContainer('Container', {
            image: containerImage,
            logging: ecs.LogDriver.awsLogs({
                streamPrefix: 'rythm',
                logGroup: logGroup,
            }),
        })

        container.addPortMappings({ containerPort: 80, hostPort: 80 })

        const cluster = new ecs.Cluster(this, 'Cluster', {
            vpc: props.vpc,
            clusterName: `${props.serviceName}-cluster`,
        })

        const securityGroup = new ec2.SecurityGroup(this, 'SecurityGroup', {
            securityGroupName: `${props.serviceName}-sg`,
            vpc: props.vpc,
            allowAllOutbound: true,
        })

        securityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(80))

        const fargateService = new ecs.FargateService(this, 'FargateService', {
            serviceName: `${props.serviceName}-fargate`,
            taskDefinition: taskDef,
            cluster: cluster,
            desiredCount: 1,
            assignPublicIp: true,
            vpcSubnets: { subnets: props.vpc.publicSubnets },
        })
    }
}
