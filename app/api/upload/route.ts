import { NextResponse } from 'next/server';
import { connectDB } from '@/app/lib/mongodb';
import { GridFSBucket } from 'mongodb';
import { randomBytes } from 'crypto';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Extract the file extension from the original file name
    const fileExtension = file.name.split('.').pop();

    // Generate a random file name (e.g., eh8fac4j3998)
    const newFileName = randomBytes(12).toString('hex') + (fileExtension ? `.${fileExtension}` : '');

    // Establish MongoDB connection and get the client
    const client = await connectDB();

    // Access the 'files' database using the client
    const db = client.db('files');

    // Connect to the 'uploads' bucket
    const bucket = new GridFSBucket(db, { bucketName: 'uploads' });

    // Create an upload stream with the new file name (including the extension)
    const uploadStream = bucket.openUploadStream(newFileName);
    const buffer = Buffer.from(await file.arrayBuffer());

    // Upload the file
    uploadStream.end(buffer);

    // Handle the finish and error events with async/await
    await new Promise<void>((resolve, reject) => {
      uploadStream.on('finish', resolve);
      uploadStream.on('error', (err: unknown) => {
        if (err instanceof Error) {
          reject(new Error(err.message));
        }
        reject(new Error('An unknown error occurred during upload.'));
      });
    });

    return NextResponse.json({ message: 'File uploaded successfully', filename: newFileName });
  } catch (err) {
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
  }
}
