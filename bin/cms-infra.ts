#!/usr/bin/env node
import 'source-map-support/register';
import { App, DefaultStackSynthesizer } from 'aws-cdk-lib';
import { CryptSniperBotStack } from '../lib/stacks/crypt-sniper-bot.stack';
import { MessageQueueStack } from '../lib/stacks/msqueu.stack';

const targetEnv = process.env.TARGET;
console.log(`Target environment: ${targetEnv}`);

const app = new App({
  autoSynth: true,
  context: {}
});

if (targetEnv === 'sniper-bot') {
  const cryptSniperBot = new CryptSniperBotStack(app, 'CryptSniperBot', {
    synthesizer: new DefaultStackSynthesizer({
      qualifier: 'sniper-bot'
    })
  });
}

if (targetEnv === 'msq') {
  const messageQueue = new MessageQueueStack(app, 'MessageQueue', {
    synthesizer: new DefaultStackSynthesizer({
      qualifier: 'ms-queue'
    })
  });
}
app.synth();
