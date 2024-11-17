#!/bin/bash
sudo dnf install -y git
sudo dnf install -y zsh
sudo sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
sudo dnf install -y postgresql15