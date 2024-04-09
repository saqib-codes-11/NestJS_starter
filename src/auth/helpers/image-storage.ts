import multerS3 from 'multer-s3'
import { awsConfig } from 'src/config/awsConfig';
import { DeleteObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { s3FileName } from 'src/utils/fileName';




export const saveImageToStorage = {
    storage: multerS3({
        s3: new S3Client({
            credentials: awsConfig
        }),
        bucket: process.env.AWS_BUCKET,
        contentType: (_, _file, cb) => {
            let contentType = 'image/png';
            cb(null, contentType);
        },
        acl: 'private',
        metadata: (_, file, cb) => {
            cb(null, { fileName: file.fieldname });
        },
        key: (_, _file, cb) => {
            let fileName: string = s3FileName(_file)
            let location: string = ''
            //예외처리해야할 파일 네임
            cb(null, location)
        },
    }),
    limits: { //멀터 파일 사이즈
        fieldSize: 2 * 1024 * 1024 * 1024,
        fileSize: 2 * 1024 * 1024 * 1024
    }
}

export const removeFile = async (bucketParams: { Bucket: string, Key: string }) => { // param = { Bucket: "BUCKET_NAME", Key: "KEY" };
    try {
        const data = await new S3Client({ credentials: awsConfig }).send(new DeleteObjectCommand(bucketParams))
        console.log("Success. Object deleted.", data);
    } catch (err) {
        console.log('S3 - Delete Fail' + err)
    }
}