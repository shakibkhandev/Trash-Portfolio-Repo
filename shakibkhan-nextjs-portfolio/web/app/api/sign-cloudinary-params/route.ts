import { v2 as cloudinary } from 'cloudinary';

export async function POST(request: Request) {
  const body = await request.json();
  const { paramsToSign } = body;

  try {
    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET!
    );

    return Response.json({ signature });
  } catch (error) {
    console.error('Error signing parameters:', error);
    return Response.json(
      { error: 'Failed to sign parameters' },
      { status: 500 }
    );
  }
}
