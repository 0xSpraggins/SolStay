cargo build-bpf --manifest-path=./Cargo.toml --bpf-out-dir=./dist/program
solana program deploy dist/program/solstay-program.so