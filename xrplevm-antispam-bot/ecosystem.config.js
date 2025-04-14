module.exports = {
    apps: [
      {
        name: "xrplevm-antispam-bot",
        script: "pnpm",
        args: "run dev:bot",
        watch: false,
        env: {
          NODE_ENV: "production"
        }
      }
    ]
  };
  