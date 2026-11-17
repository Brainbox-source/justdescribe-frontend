
import { ApiError } from './apiError';
import { buildRateLimitError } from './rateLimit';
import { REQUEST_TIMEOUT_MS } from '../constants';

const API_BASE_URL = 'https://justdescribe-server.onrender.com';

/**
 * @typedef {Object} Recommendation
 * @property {string} subject
 * @property {string} classification
 * @property {string} case
 * @property {string} natureOfCase
 * @property {string} description
 */

function isApiTicketResponse(value) {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  return (
    typeof value.subject === 'string' &&
    typeof value.classification === 'string' &&
    typeof value.case === 'string' &&
    typeof value.nature_of_case === 'string' &&
    typeof value.description === 'string'
  );
}

function buildStatusError(status) {
  if (status === 401) {
    return new ApiError(
      'unauthorized',
      'Your session has expired. Please sign out and sign in again.'
    );
  }

  if (status === 422) {
    return new ApiError(
      'validation',
      'Your description could not be processed. Check that it is between 10 and 2000 characters.'
    );
  }

  return new ApiError(
    'server',
    'Something went wrong on our side. Try again in a moment.'
  );
}

/**
 * @param {string} description
 * @returns {Promise<Recommendation>}
 */
export async function requestRecommendation(description) {
  if (!navigator.onLine) {
    throw new ApiError(
      'offline',
      'You are offline. Connect to the internet and try again.'
    );
  }

  const token = localStorage.getItem('auth_token');
  let response;

  try {
    response = await fetch(`${API_BASE_URL}/tickets/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ description }),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === 'TimeoutError') {
      throw new ApiError(
        'timeout',
        'This is taking too long. Check your connection and try again.'
      );
    }

    throw new ApiError(
      'network',
      'Something went wrong. Try again.'
    );
  }

  if (!response.ok) {
    if (response.status === 429) {
      throw await buildRateLimitError(response);
    }

    throw buildStatusError(response.status);
  }

  let body;

  try {
    body = await response.json();
  } catch {
    throw new ApiError(
      'unexpected_response',
      'The server sent a response we could not read. Try again.'
    );
  }

  if (!isApiTicketResponse(body)) {
    throw new ApiError(
      'unexpected_response',
      'The server sent a response we could not read. Try again.'
    );
  }

  return {
    subject: body.subject,
    classification: body.classification,
    case: body.case,
    natureOfCase: body.nature_of_case,
    description: body.description,
  };
}
