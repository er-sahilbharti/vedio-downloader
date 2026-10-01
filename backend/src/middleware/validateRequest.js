import { z } from 'zod';

const urlSchema = z.string().trim().url({ message: 'Invalid URL format.' }).refine((value) => {
  try {
    const parsed = new URL(value);
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
}, 'URL must use http or https.');

const formatSchema = z.object({
  id: z.string().min(1, 'Format is required.'),
  label: z.string().optional(),
  quality: z.string().optional(),
  extension: z.string().optional(),
});

export function validateUrlRequest(req, res, next) {
  const schema = z.object({
    url: urlSchema,
  });

  const result = schema.safeParse(req.body);

  if (!result.success) {
    const error = result.error.issues[0];
    return res.status(400).json({ success: false, message: error.message, code: 'INVALID_URL' });
  }

  next();
}

export function validateDownloadRequest(req, res, next) {
  const schema = z.object({
    url: urlSchema,
    formatId: z.string().min(1, 'formatId is required.'),
  });

  const result = schema.safeParse(req.body);

  if (!result.success) {
    const error = result.error.issues[0];
    return res.status(400).json({ success: false, message: error.message, code: 'INVALID_URL' });
  }

  next();
}

export function validateIdParam(schemaName) {
  return (req, res, next) => {
    const schema = z.object({
      [schemaName]: z.string().min(1, `${schemaName} is required.`),
    });

    const result = schema.safeParse(req.params);
    if (!result.success) {
      return res.status(400).json({ success: false, message: `${schemaName} is invalid.`, code: 'INVALID_URL' });
    }

    next();
  };
}

export function validatePagination(req, res, next) {
  const schema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(50).default(10),
  });

  const result = schema.safeParse({
    page: req.query.page,
    limit: req.query.limit,
  });

  if (!result.success) {
    return res.status(400).json({ success: false, message: 'Pagination values are invalid.', code: 'INVALID_URL' });
  }

  req.query.page = String(result.data.page);
  req.query.limit = String(result.data.limit);
  next();
}

export { formatSchema };
