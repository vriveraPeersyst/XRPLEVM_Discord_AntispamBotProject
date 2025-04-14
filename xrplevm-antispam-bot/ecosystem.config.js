module.exports = {
    apps: [
      {
        name: "xrplevm-antispam-bot",
        script: "npm",
        args: "run dev:bot",
        watch: false,
        env: {
          NODE_ENV: "production"
        }
      }
    ]
  };
  