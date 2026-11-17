import { ApiError } from './apiError';

const DEFAULT_RATE_LIMIT_MESSAGE =
  'Too many requests right now. Please try again later.';

function formatWaitTime(totalSeconds) {
  if (totalSeconds < 60) {
    return 'less than a minute';
  }

  const totalMinutes = Math.ceil(totalSeconds / 60);

  if (totalMinutes < 60) {
    return totalMinutes === 1
      ? '1 minute'
      : `${totalMinutes} minutes`;
  }

  const totalHours = Math.ceil(totalMinutes / 60);

  return totalHours === 1
    ? '1 hour'
    : `${totalHours} hours`;
}

function parseRateLimitBody(data) {
  if (typeof data !== 'object' || data === null) {
    return null;
  }

  const detail = data.detail;
  const scope = data.scope;
  const retryAfterSeconds = data.retry_after_seconds;

  if (typeof detail !== 'string') {
    return null;
  }

  return {
    detail,
    scope: scope === 'global' ? 'global' : 'personal',
    retryAfterSeconds:
      typeof retryAfterSeconds === 'number' && retryAfterSeconds > 0
        ? retryAfterSeconds
        : null,
  };
}

export async function buildRateLimitError(response) {
  let data = null;

  try {
    data = await response.json();
  } catch {
    return new ApiError('rate_limit', DEFAULT_RATE_LIMIT_MESSAGE);
  }

  const body = parseRateLimitBody(data);

  if (body === null) {
    return new ApiError('rate_limit', DEFAULT_RATE_LIMIT_MESSAGE);
  }

  if (body.retryAfterSeconds === null) {
    return new ApiError('rate_limit', body.detail);
  }

  const waitText = formatWaitTime(body.retryAfterSeconds);

  return new ApiError(
    'rate_limit',
    `${body.detail} Try again in ${waitText}.`
  );
}
