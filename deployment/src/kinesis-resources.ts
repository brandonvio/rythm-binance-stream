import * as cdk from 'aws-cdk-lib'
import * as ecr from 'aws-cdk-lib/aws-ecr'
import * as iam from 'aws-cdk-lib/aws-iam'
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb'
import * as logs from 'aws-cdk-lib/aws-logs'
import * as ecs from 'aws-cdk-lib/aws-ecs'
import * as ec2 from 'aws-cdk-lib/aws-ec2'
import * as kinesis from 'aws-cdk-lib/aws-kinesis'
import * as s3 from 'aws-cdk-lib/aws-s3'
import * as kinesisfirehose from 'aws-cdk-lib/aws-kinesisfirehose'
import { Construct } from 'constructs'
import { FargateService } from './fargate-service'

export class KinesisResources {
    public static GetKinesisFirehouse(scope: Construct) {
        const firehoseBucket = new s3.Bucket(scope, 'RythmDataBucket', {
            bucketName: 'data.rythm.cc',
            encryption: s3.BucketEncryption.S3_MANAGED,
            blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
            publicReadAccess: false,
        })

        const kf = new kinesisfirehose.CfnDeliveryStream(scope, '', {
            s3DestinationConfiguration: {
                bucketArn: firehoseBucket.bucketArn,
                roleArn: '',
            },
        })
    }
}
