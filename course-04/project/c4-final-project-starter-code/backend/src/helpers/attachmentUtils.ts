import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'

const XAWS = AWSXRay.captureAWS(AWS)
const s3 = new XAWS.S3({
    signatureVersion: 'v4'
});

export class AttachmentUtils {

    constructor(
        private readonly bucketName = process.env.ATTACHMENT_S3_BUCKET,
        private readonly urlExpiration = process.env.SIGNED_URL_EXPIRATION) {
    }

    createAttachmentPresignedUrl(todoId: string): string {
        return s3.getSignedUrl('putObject', {
            Bucket: this.bucketName,
            Key: `${todoId}/image.png`,
            Expires: this.urlExpiration
        })
    }  
    
    getAttachmentUrl(todoId: string): string {
        return `https://${this.bucketName}.s3.amazonaws.com/${todoId}/image.png`
    }
}