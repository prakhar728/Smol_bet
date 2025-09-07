```mermaid
%%{ init: { 'theme': 'default', 'flowchart': { 'useMaxWidth': true, 'htmlLabels': true } , 'themeVariables': { 'fontSize': '16px' }, 'securityLevel': 'loose' } }
flowchart LR
    %% --- Actors ---
    UA[Bettor A]
    UB[Bettor B]
    TW[X Post / Reply]
    BOT[Smol Bet Bot - NLP Parser and Validation]
    ESC[Escrow Smart Contract - NEAR]
    ORC[Resolver - TEE and Verifiable AI]
    DS[Public Data APIs / Web]
    TRES[Protocol Treasury - 1% fee]
    WIN[Winner]

    %% --- Intent + Creation ---
    UA -->|tweets bet terms| TW
    UB -->|accepts in reply| TW
    TW -->|mention / webhook| BOT
    BOT -->|valid terms + deposit links| UA
    BOT -->|valid terms + deposit links| UB

    %% --- Deposits (Value In) ---
    UA -->|stake| ESC
    UB -->|stake| ESC

    %% --- Resolution Trigger ---
    BOT -->|resolution request| ORC
    ORC -.->|fetch / verify| DS
    DS -.->|signed / attested result| ORC
    ORC -->|signed outcome| ESC

    %% --- Settlement (Value Out) ---
    ESC -->|payout 99%| WIN
    ESC -->|protocol fee 1%| TRES

    %% --- Optional surfaces ---
    BOT -.->|updates / leaderboard| TW
```