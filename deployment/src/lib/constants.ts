export enum FargateCpu {
    "Cpu256" = "256",       // 512 (0.5GB), 1024 (1GB), 2048 (2GB)
    "Cpu512" = "512",       // 1024 (1GB), 2048 (2GB), 3072 (3GB), 4096 (4GB)
    "Cpu1024" = "1024",     // 2048 (2GB), 3072 (3GB), 4096 (4GB), 5120 (5GB), 6144 (6GB), 7168 (7GB), 8192 (8GB)
    "Cpu2048" = "2048",     // Between 4096 (4GB) and 16384 (16GB) in increments of 1024 (1GB)
    "Cpu4096" = "4096"      // Between 8192 (8GB) and 30720 (30GB) in increments of 1024 (1GB)
}

export enum FargateMiB {
    "Mem512" = "512",
    "Mem1024" = "1024",
    "Mem2048" = "2048",
    "Mem3072" = "3072",
    "Mem4096" = "4096",
    "Mem5120" = "5120",
    "Mem6144" = "6144",
    "Mem7168" = "7168",
    "Mem8192" = "8192",
}