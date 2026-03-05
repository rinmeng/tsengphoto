import { createRouteHandler } from 'uploadthing/next';
import { NextRequest } from 'next/server';

import { ourFileRouter } from './core';

const handlers = createRouteHandler({
  router: ourFileRouter,
});

export async function GET(req: NextRequest) {
  return handlers.GET(req);
}

export async function POST(req: NextRequest) {
  return handlers.POST(req);
}
