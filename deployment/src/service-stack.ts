import * as cdk from 'aws-cdk-lib'
import * as ecr from 'aws-cdk-lib/aws-ecr'
import * as iam from 'aws-cdk-lib/aws-iam'
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb'
import * as logs from 'aws-cdk-lib/aws-logs'
import * as ecs from 'aws-cdk-lib/aws-ecs'
import * as ec2 from 'aws-cdk-lib/aws-ec2'
import { Construct } from 'constructs'
import { FargateService } from './fargate-service'

interface RythmBinanceStreamStackProps extends cdk.StackProps {
    readonly imageTag: string
}

export class RythmBinanceStreamStack extends cdk.Stack {
    constructor(
        scope: Construct,
        id: string,
        props: RythmBinanceStreamStackProps
    ) {
        super(scope, id, props)

        const vpc = ec2.Vpc.fromLookup(this, 'RythmVpc', {
            vpcName: 'RythmInfrastructureStack/RythmVpc',
        })

        new FargateService(this, 'RythmBinanceService', {
            imageTag: props.imageTag,
            repoName: 'rythm-binance-stream',
            serviceName: 'rythm-binance-stream',
            vpc,
        })
    }
}
