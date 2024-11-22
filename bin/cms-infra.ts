#!/usr/bin/env node
import 'source-map-support/register';
import { App, DefaultStackSynthesizer } from 'aws-cdk-lib';
import { CryptSniperBotStack } from '../lib/stacks/crypt-sniper-bot.stack';

const app = new App({
  autoSynth: true,
  context: {}
});

const cryptSniperBot = new CryptSniperBotStack(app, 'CryptSniperBot', {
  synthesizer: new DefaultStackSynthesizer({
    qualifier: 'sniper-bot'
  })
});

app.synth();
