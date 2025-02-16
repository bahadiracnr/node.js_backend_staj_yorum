const { app } = require('./app');
const PORT = process.env.PORT || 4000;

const server = app
  .listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
  })
  .on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`Port ${PORT} is already in use. Try a different port.`);
      process.exit(1);
    } else {
      console.error('Server error:', err);
    }
  });
