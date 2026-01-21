#!/bin/bash

# AI Config Installer
# Installs AI agent configurations to your project

set -e

# Colors and emojis for better UX
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_header() {
    echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}  $1${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"
}

show_usage() {
    cat << EOF
Usage: $0 [OPTIONS] [DESTINATION]

Install AI agent configurations to your project.

OPTIONS:
    --link          Create symlinks instead of copying files
    -h, --help      Show this help message

DESTINATION:
    Target directory where configs will be installed (default: current directory)

EXAMPLES:
    $0                          # Install to current directory
    $0 ~/my-project            # Install to specific directory
    $0 --link ~/my-project     # Create symlinks to specific directory

EOF
    exit 0
}

# Parse arguments
USE_LINK=false
DEST_DIR="."

while [[ $# -gt 0 ]]; do
    case $1 in
        --link)
            USE_LINK=true
            shift
            ;;
        -h|--help)
            show_usage
            ;;
        *)
            DEST_DIR="$1"
            shift
            ;;
    esac
done

# Get script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && cd .. && pwd )"

# Validate destination directory
if [ ! -d "$DEST_DIR" ]; then
    print_error "Destination directory does not exist: $DEST_DIR"
    exit 1
fi

# Convert to absolute path
DEST_DIR="$(cd "$DEST_DIR" && pwd)"

print_header "🤖 AI Config Installer"
print_info "Source: $SCRIPT_DIR"
print_info "Destination: $DEST_DIR"
if [ "$USE_LINK" = true ]; then
    print_info "Mode: Symlink"
else
    print_info "Mode: Copy"
fi

# Available configurations
declare -A CONFIGS
CONFIGS[".agents"]="Generic AI Agent Instructions"
CONFIGS[".claude"]="Claude AI Configuration"
CONFIGS[".cursor"]="Cursor Editor Rules"
CONFIGS[".codex"]="OpenAI Codex Configuration"
CONFIGS[".gemini"]="Google Gemini Configuration"

# Interactive selection
echo ""
print_info "Select configurations to install:"
echo ""

declare -A SELECTED
for config in "${!CONFIGS[@]}"; do
    read -p "$(echo -e "  Install ${BLUE}$config${NC} (${CONFIGS[$config]})? [y/N]: ")" response
    case "$response" in
        [yY][eE][sS]|[yY])
            SELECTED[$config]=true
            ;;
        *)
            SELECTED[$config]=false
            ;;
    esac
done

# Confirm installation
echo ""
print_warning "Ready to install selected configurations."
read -p "$(echo -e "${YELLOW}Continue? [y/N]: ${NC}")" confirm

if [[ ! "$confirm" =~ ^[yY]([eE][sS])?$ ]]; then
    print_info "Installation cancelled."
    exit 0
fi

# Create backup directory
BACKUP_DIR="$DEST_DIR/.config-backup-$(date +%Y%m%d-%H%M%S)"

# Install configurations
echo ""
print_header "📦 Installing Configurations"

install_config() {
    local config=$1
    local src="$SCRIPT_DIR/$config"
    local dest="$DEST_DIR/$config"
    
    if [ ! -d "$src" ]; then
        print_warning "Source not found: $config (skipping)"
        return
    fi
    
    # Backup existing configuration
    if [ -e "$dest" ]; then
        if [ ! -d "$BACKUP_DIR" ]; then
            mkdir -p "$BACKUP_DIR"
            print_info "Created backup directory: $BACKUP_DIR"
        fi
        print_warning "Backing up existing $config"
        cp -r "$dest" "$BACKUP_DIR/"
    fi
    
    # Install configuration
    if [ "$USE_LINK" = true ]; then
        # Remove existing if it's not already a symlink to the same location
        if [ -e "$dest" ]; then
            if [ -L "$dest" ] && [ "$(readlink "$dest")" = "$src" ]; then
                print_info "Symlink already exists for $config"
                return
            fi
            rm -rf "$dest"
        fi
        ln -s "$src" "$dest"
        print_success "Linked $config"
    else
        # Copy files
        if [ -d "$dest" ]; then
            rm -rf "$dest"
        fi
        cp -r "$src" "$dest"
        print_success "Copied $config"
    fi
}

for config in "${!SELECTED[@]}"; do
    if [ "${SELECTED[$config]}" = true ]; then
        install_config "$config"
    fi
done

# Summary
echo ""
print_header "✨ Installation Complete"

if [ -d "$BACKUP_DIR" ]; then
    print_info "Backups saved to: $BACKUP_DIR"
fi

print_success "Configurations installed successfully!"
echo ""
print_info "Next steps:"
echo "  1. Review and customize the installed configurations"
echo "  2. Update placeholders with your project-specific information"
echo "  3. Commit the configurations to your repository"
echo ""
print_info "For more information, see: https://github.com/ivannxbt/config"
echo ""
