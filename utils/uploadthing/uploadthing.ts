import {
  generateUploadButton,
  generateUploadDropzone,
  generateReactHelpers,
} from '@uploadthing/react';

import type { OurFileRouter } from '@/app/api/v1/uploadthing/core';

export const UploadButton = generateUploadButton<OurFileRouter>({
  url: '/api/v1/uploadthing',
});

export const UploadDropzone = generateUploadDropzone<OurFileRouter>({
  url: '/api/v1/uploadthing',
});

export const { useUploadThing } = generateReactHelpers<OurFileRouter>({
  url: '/api/v1/uploadthing',
});
