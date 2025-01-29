import { PrismaClient } from '@prisma/client';
import { ethers,verifyMessage } from 'ethers'; // Importing ethers properly
import { NextRequest, NextResponse } from 'next/server'; // For Next.js App Directory (using NextRequest, NextResponse)

const prisma = new PrismaClient();

// This handler is for POST requests to authenticate Web3 login via Ethereum signature
export async function POST(req: NextRequest) {
  try {
    const { address, signature, message } = await req.json(); // Parse the incoming JSON body

    // Verify the message signature using ethers.js
    const signerAddress = verifyMessage(message, signature);
    
    // Check if the address from the signature matches the provided address
    if (signerAddress.toLowerCase() !== address.toLowerCase()) {
      return NextResponse.json({ error: 'Signature verification failed' }, { status: 401 });
    }

    // Check if the user exists based on their wallet address
    let user = await prisma.user.findUnique({ where: { walletAddress: address } });

    // If user does not exist, create a new user
    if (!user) {
      user = await prisma.user.create({ data: { walletAddress: address } });
    }

    // Return user data in the response
    return NextResponse.json({ user });

  } catch (error) {
    console.error('Error during Web3 authentication:', error);
    return NextResponse.json({ error: 'An error occurred during authentication' }, { status: 500 });
  }
}
