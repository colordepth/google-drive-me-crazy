const unknownEndpoint = (req, res) => {
  res.status(404).end(JSON.stringify({ error: 'unknown endpoint' }));
}

module.exports = unknownEndpoint;