import { ORBIT_AGENTS } from "../../src/config/models.js";

export interface VerificationResult {
  provider: string;
  modelId: string;
  status:
    | 'CONNECTED'
    | 'INVALID KEY'
    | 'PROVIDER ERROR'
    | 'RATE LIMITED'
    | 'NOT CONFIGURED';
  message: string;
}

/**
 * Performs a genuine minimal authenticated API request against the
 * configured provider.
 *
 * IMPORTANT:
 * - Never logs API keys.
 * - Never returns API keys.
 * - BYOK verification is completely separate from Product Demo mode.
 */
export async function verifyByokApiKey(
  modelId: string,
  apiKey: string
): Promise<VerificationResult> {
  const normalizedModelId = String(modelId || '').trim();
  const key = String(apiKey || '').trim();

  if (!normalizedModelId) {
    return {
      provider: 'Unknown',
      modelId: '',
      status: 'NOT CONFIGURED',
      message: 'Model ID is required.',
    };
  }

  if (!key) {
    return {
      provider: 'Unknown',
      modelId: normalizedModelId,
      status: 'NOT CONFIGURED',
      message: 'API key not provided.',
    };
  }

  /**
   * Resolve provider from ORBIT's configured agent definitions.
   *
   * We support:
   * - exact modelId
   * - model
   * - provider name
   */
  const agent = ORBIT_AGENTS.find(
    (agent) =>
      agent.modelId === normalizedModelId ||
      agent.model === normalizedModelId ||
      agent.provider === normalizedModelId
  );

  if (!agent) {
    return {
      provider: 'Unknown',
      modelId: normalizedModelId,
      status: 'NOT CONFIGURED',
      message: `No ORBIT agent configuration found for "${normalizedModelId}".`,
    };
  }

  const provider = agent.provider;
  const targetModelId = agent.modelId;

  try {
    /**
     * GOOGLE GEMINI
     */
    if (provider === 'Google Gemini') {
      const url =
        `https://generativelanguage.googleapis.com/v1beta/models/` +
        `${encodeURIComponent(targetModelId)}:generateContent?key=${encodeURIComponent(key)}`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: 'Ping' }],
            },
          ],
        }),
      });

      if (response.ok) {
        return {
          provider,
          modelId: targetModelId,
          status: 'CONNECTED',
          message: 'Gemini API key authenticated successfully.',
        };
      }

      if (response.status === 429) {
        return {
          provider,
          modelId: targetModelId,
          status: 'RATE LIMITED',
          message: 'Gemini rate limit reached. The API key may still be valid.',
        };
      }

      if (
        response.status === 400 ||
        response.status === 401 ||
        response.status === 403
      ) {
        return {
          provider,
          modelId: targetModelId,
          status: 'INVALID KEY',
          message:
            'Gemini rejected the request. Check the API key, model access, and API configuration.',
        };
      }

      return {
        provider,
        modelId: targetModelId,
        status: 'PROVIDER ERROR',
        message: `Gemini server returned HTTP ${response.status}.`,
      };
    }

    /**
     * MISTRAL
     */
    if (provider === 'Mistral') {
      const response = await fetch(
        'https://api.mistral.ai/v1/models',
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${key}`,
            Accept: 'application/json',
          },
        }
      );

      if (response.ok) {
        return {
          provider,
          modelId: targetModelId,
          status: 'CONNECTED',
          message: 'Mistral API key authenticated successfully.',
        };
      }

      if (response.status === 429) {
        return {
          provider,
          modelId: targetModelId,
          status: 'RATE LIMITED',
          message:
            'Mistral rate limit reached. The API key may still be valid.',
        };
      }

      if (response.status === 401 || response.status === 403) {
        return {
          provider,
          modelId: targetModelId,
          status: 'INVALID KEY',
          message: 'Mistral rejected the API key.',
        };
      }

      return {
        provider,
        modelId: targetModelId,
        status: 'PROVIDER ERROR',
        message: `Mistral server returned HTTP ${response.status}.`,
      };
    }

    /**
     * CEREBRAS
     */
    if (provider === 'Cerebras') {
      const response = await fetch(
        'https://api.cerebras.ai/v1/models',
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${key}`,
            Accept: 'application/json',
          },
        }
      );

      if (response.ok) {
        return {
          provider,
          modelId: targetModelId,
          status: 'CONNECTED',
          message: 'Cerebras API key authenticated successfully.',
        };
      }

      if (response.status === 429) {
        return {
          provider,
          modelId: targetModelId,
          status: 'RATE LIMITED',
          message:
            'Cerebras rate limit reached. The API key may still be valid.',
        };
      }

      if (response.status === 401 || response.status === 403) {
        return {
          provider,
          modelId: targetModelId,
          status: 'INVALID KEY',
          message: 'Cerebras rejected the API key.',
        };
      }

      return {
        provider,
        modelId: targetModelId,
        status: 'PROVIDER ERROR',
        message: `Cerebras server returned HTTP ${response.status}.`,
      };
    }

    /**
     * UNKNOWN PROVIDER
     */
    return {
      provider,
      modelId: targetModelId,
      status: 'NOT CONFIGURED',
      message: `Provider "${provider}" is not supported by the BYOK verifier.`,
    };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : String(error);

    return {
      provider,
      modelId: targetModelId,
      status: 'PROVIDER ERROR',
      message: `Network error verifying ${provider}: ${message}`,
    };
  }
}
