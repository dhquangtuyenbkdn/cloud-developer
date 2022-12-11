import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'

const XAWS = AWSXRay.captureAWS(AWS)
const s3 = new XAWS.S3({
    signatureVersion: 'v4'
});

export class AttachmentUtils {
    private readonly bucketName = process.env.IMAGES_S3_BUCKET;
    private readonly urlExpiration = process.env.SIGNED_URL_EXPIRATION;

    constructor() {
    }

    createAttachmentPresignedUrl(todoId: string): string {
        return s3.getSignedUrl('putObject', {
            Bucket: this.bucketName,
            Key: todoId,
            Expires: this.urlExpiration
        })
    }
}