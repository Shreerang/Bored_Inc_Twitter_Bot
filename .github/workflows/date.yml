name: Date

on:
  schedule:
    - cron: '26 17 * * *'
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v2.3.4
      - name: Setup Node.js
        uses: actions/setup-node@v2.1.4
      - name: Tweet This date in history
        run: |
          npm ci
          node date.js
        env:
          CI: true
          CONSUMER_KEY: ${{ secrets.CONSUMER_KEY }}
          CONSUMER_SECRET: ${{ secrets.CONSUMER_SECRET }}
          ACCESS_TOKEN: ${{ secrets.ACCESS_TOKEN }}
          ACCESS_TOKEN_SECRET: ${{ secrets.ACCESS_TOKEN_SECRET }}
