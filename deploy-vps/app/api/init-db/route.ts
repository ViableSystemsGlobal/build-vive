import { NextRequest, NextResponse } from 'next/server';
import { database } from '../../lib/database';

export async function POST(request: NextRequest) {
  try {
    if (!database.isConfigured()) {
      return NextResponse.json(
        { error: 'Database not configured. Please set DATABASE_URL or individual DB environment variables.' },
        { status: 500 }
      );
    }

    console.log('Initializing database tables...');
    
    // Initialize database tables
    await database.initializeTables();
    
    console.log('Database initialization completed successfully');
    
    return NextResponse.json({
      success: true,
      message: 'Database initialized successfully',
      tables: [
        'homepage_data',
        'quotes', 
        'chat_history',
        'knowledge_base'
      ]
    });

  } catch (error) {
    console.error('Database initialization error:', error);
    return NextResponse.json(
      { 
        error: 'Database initialization failed', 
        details: error instanceof Error ? error.message : String(error) 
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    if (!database.isConfigured()) {
      return NextResponse.json(
        { error: 'Database not configured. Please set DATABASE_URL or individual DB environment variables.' },
        { status: 500 }
      );
    }

    // Check if tables exist
    const result = await database.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('homepage_data', 'quotes', 'chat_history', 'knowledge_base')
    `);

    const existingTables = result.rows.map(row => row.table_name);
    const expectedTables = ['homepage_data', 'quotes', 'chat_history', 'knowledge_base'];
    const missingTables = expectedTables.filter(table => !existingTables.includes(table));

    return NextResponse.json({
      configured: true,
      existingTables,
      missingTables,
      allTablesExist: missingTables.length === 0
    });

  } catch (error) {
    console.error('Database check error:', error);
    return NextResponse.json(
      { 
        error: 'Database check failed', 
        details: error instanceof Error ? error.message : String(error) 
      },
      { status: 500 }
    );
  }
}
