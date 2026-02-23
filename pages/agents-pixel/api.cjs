/**
 * Agent Pixel API
 * Provides agent status for the pixel scene
 */

module.exports = (ctx) => {
  return {
    routes: {
      'GET /status': async (req, res) => {
        // Proxy to main OpenClaw API
        try {
          const response = await fetch('http://localhost:8090/api/openclaw/agents');
          const data = await response.json();
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(data));
        } catch (error) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ status: 'error', message: error.message }));
        }
      }
    }
  };
};
