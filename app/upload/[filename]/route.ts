import { connectDB } from '@/app/lib/mongodb';
import { GridFSBucket } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: { filename: string } }
) {
  try {
    const { filename } = params;

    if (!filename) {
      return NextResponse.json({ error: 'Filename is required' }, { status: 400 });
    }

    const client = await connectDB();
    const db = client.db('files');
    const bucket = new GridFSBucket(db, { bucketName: 'uploads' });

    const downloadStream = bucket.openDownloadStreamByName(filename);

    const stream = new ReadableStream({
      start(controller) {
        downloadStream.on('data', (chunk) => controller.enqueue(chunk));
        downloadStream.on('end', () => controller.close());
        downloadStream.on('error', (error) => controller.error(error));
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${filename}"`,
      }
    });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';

    if (errorMessage.includes('FileNotFound')) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
