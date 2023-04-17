module.exports = {
  settings: {
    'import/resolver': {
      alias: {
        map: [
          ['@scss', './src/assets/scss'],
          ['@socket-context', './src/context/SocketContext.jsx'],
        ],
        extensions: ['.js', '.jsx'],
      },
    },
  },
};
