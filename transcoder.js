/* const { spawnSync } = require("child_process");
const { readFileSync, writeFileSync, unlinkSync } = require("fs");
const AWS = require("aws-sdk");
const outputBucketName = process.env.outputBucket;

const s3 = new AWS.S3();

module.exports.transcode = async (event, context) => {
  if (!event.Records) {
    console.log("not an s3 invocation!");
    return;
  }

  for (const record of event.Records) {
    if (!record.s3) {
      console.log("not an s3 invocation!");
      continue;
    }

    if (record.s3.object.key.endsWith(".mp4")) {
      console.log("already an mp4");
      continue;
    }

    // get the file
    const s3Object = await s3
      .getObject({
        Bucket: record.s3.bucket.name,
        Key: record.s3.object.key
      })
      .promise();

    // write file to disk
    writeFileSync(`/tmp/${record.s3.object.key}`, s3Object.Body);

    // convert to mp4!
    spawnSync(
      "/opt/ffmpeg/ffmpeg",
      [
        "-i",
        `/tmp/${record.s3.object.key}`,
        `/tmp/${record.s3.object.key}.mp4`
      ],
      { stdio: "inherit" }
    );

    // read mp4 from disk
    const mp4File = readFileSync(`/tmp/${record.s3.object.key}.mp4`);

    // delete the temp files
    unlinkSync(`/tmp/${record.s3.object.key}.mp4`);
    unlinkSync(`/tmp/${record.s3.object.key}`);

    // upload mp4 to s3
    await s3
      .putObject({
        Bucket: outputBucketName,
        Key: `${record.s3.object.key}.mp4`,
        Body: mp4File
      })
      .promise();
  }
}; */