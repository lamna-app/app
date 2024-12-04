FROM debian:bookworm-slim AS base
ENV USER="developer"
ENV GROUP="$USER"
ENV HOME="/home/$USER"
ENV USEFUL_PACKAGES="nano vim"
USER root

RUN apt-get update \
    && apt-get install -y --no-install-recommends --no-install-suggests apt-transport-https ca-certificates curl \
        git openssh-client sudo unzip zsh \
        $USEFUL_PACKAGES \
    && apt-get install -y libwebkit2gtk-4.1-dev build-essential wget file libxdo-dev libssl-dev \
        libayatana-appindicator3-dev librsvg2-dev \
    && apt-get autoremove -y \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*;

RUN addgroup $GROUP \
    && useradd -mg $USER -G sudo -s /usr/bin/zsh $USER \
    && echo "%sudo ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers;

FROM base AS node
USER $USER

RUN curl -fsLS https://fnm.vercel.app/install | bash -s -- --skip-shell --install-dir "$HOME/.local/share/fnm";

ENV PATH="$HOME/.local/share/fnm:$PATH"

RUN eval "$(fnm env --shell bash)" \
    && fnm use --install-if-missing 22;

FROM node AS bun
USER $USER
ENV BUN_INSTALL="$HOME/.bun"

RUN curl -fsSL https://bun.sh/install | bash;

FROM bun AS shell
USER $USER
ENV PATH="$PATH:$HOME/.bun/bin"

RUN sh -c "$(curl -fsSL https://install.ohmyz.sh)" \
    && git clone --depth=1 https://github.com/romkatv/powerlevel10k.git $HOME/.oh-my-zsh/custom/themes/powerlevel10k;

COPY .zshrc .p10k.zsh $HOME

FROM shell AS final
USER $USER

CMD ["sleep", "infinity"]
