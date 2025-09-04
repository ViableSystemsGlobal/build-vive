import { NextRequest, NextResponse } from 'next/server';
import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';

export async function GET(): Promise<NextResponse> {
  try {
    const dataDir = join(process.cwd(), 'data');
    const quotesFile = join(dataDir, 'quotes.json');
    
    let quotes: Array<{
      id: string;
      timestamp: string;
      [key: string]: unknown;
    }> = [];
    
    try {
      const data = await readFile(quotesFile, 'utf-8');
      quotes = JSON.parse(data);
    } catch {
      // File doesn't exist or is invalid, return empty array
      console.log("No quotes file found, returning empty array");
    }
    
    // Sort quotes by timestamp (newest first)
    quotes.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    return NextResponse.json({ quotes });
    
  } catch (error) {
    console.error('Error fetching quotes:', error);
    return NextResponse.json({ error: 'Failed to fetch quotes' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { quoteId, status, notes } = body;
    
    if (!quoteId || !status) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    const dataDir = join(process.cwd(), 'data');
    const quotesFile = join(dataDir, 'quotes.json');
    
    let quotes = [];
    
    try {
      const data = await readFile(quotesFile, 'utf-8');
      quotes = JSON.parse(data);
    } catch (error) {
      // File doesn't exist or is invalid, return error
      return NextResponse.json({ error: 'No quotes found' }, { status: 404 });
    }
    
    // Find and update the quote
    const quoteIndex = quotes.findIndex((q: { id: string; [key: string]: unknown }) => q.id === quoteId);
    if (quoteIndex === -1) {
      return NextResponse.json({ error: 'Quote not found' }, { status: 404 });
    }
    
    quotes[quoteIndex].status = status;
    if (notes) {
      quotes[quoteIndex].notes = notes;
    }
    quotes[quoteIndex].updatedAt = new Date().toISOString();
    
    // Save updated quotes
    await writeFile(quotesFile, JSON.stringify(quotes, null, 2));
    
    return NextResponse.json({ success: true, quote: quotes[quoteIndex] });
    
  } catch (error) {
    console.error('Error updating quote:', error);
    return NextResponse.json({ error: 'Failed to update quote' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { quoteId } = body;
    
    if (!quoteId) {
      return NextResponse.json({ error: 'Missing quote ID' }, { status: 400 });
    }
    
    const dataDir = join(process.cwd(), 'data');
    const quotesFile = join(dataDir, 'quotes.json');
    
    let quotes = [];
    
    try {
      const data = await readFile(quotesFile, 'utf-8');
      quotes = JSON.parse(data);
    } catch (error) {
      // File doesn't exist or is invalid, return error
      return NextResponse.json({ error: 'No quotes found' }, { status: 404 });
    }
    
    // Find and remove the quote
    const quoteIndex = quotes.findIndex((q: { id: string; [key: string]: unknown }) => q.id === quoteId);
    if (quoteIndex === -1) {
      return NextResponse.json({ error: 'Quote not found' }, { status: 404 });
    }
    
    // Remove the quote
    quotes.splice(quoteIndex, 1);
    
    // Save updated quotes
    await writeFile(quotesFile, JSON.stringify(quotes, null, 2));
    
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('Error deleting quote:', error);
    return NextResponse.json({ error: 'Failed to delete quote' }, { status: 500 });
  }
}
