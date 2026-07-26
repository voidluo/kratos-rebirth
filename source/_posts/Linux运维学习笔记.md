---
title: Linux运维学习笔记
date: 2026-07-26 09:18:12
author: void
categories: 学习心得
tags:
- linux
- 运维
sticky: 1
#cover:
comments: true
toc: true
---

## 前言

本文档纯粹是初学者的一面之词，谬误之处还请海涵。





## 目录

- [一、Linux 基础命令](#一、Linux-基础命令)
- [二、用户与权限管理](#二、用户与权限管理)
- [三、进程管理](#三、进程管理)
- [四、系统信息与监控](#四、系统信息与监控)
- [五、磁盘与文件系统](#五、磁盘与文件系统)
- [六、LVM 逻辑卷管理](#六、LVM-逻辑卷管理)
- [七、RAID 磁盘阵列](#七、RAID-磁盘阵列)
- [八、网络管理](#八、网络管理)
- [九、交换机配置](#九、交换机配置)
- [十、软件包管理](#十、软件包管理)
- [十一、服务与中间件](#十一、服务与中间件)
- [十二、数据库 MySQL/MariaDB](#十二、数据库-MySQL-MariaDB)
- [十三、TCP/IP 协议深入](#十三、TCP-IP-协议深入)
- [十四、性能调优](#十四、性能调优)
- [十五、安全加固与应急响应](#十五、安全加固与应急响应)
- [十六、Shell 脚本与实用工具](#十六、Shell-脚本与实用工具)

---

## 一、Linux 基础命令

### 1.1 Vim 编辑器

```vim
" 显示设置
set nu          显示行号
set nonu        取消行号
set list        显示空格及空行

" 复制粘贴
yy              复制当前行
3yy             复制3行
p               粘贴
dd              删除当前行
3dd             删除3行
dG              删除光标行到末尾
u               撤销

" 光标移动
G               光标到最后一行
gg              移动到行首
:数字           跳转到指定行

" 保存退出
wq!             强制保存并退出
q!              强制退出

" 查找替换
s/123/321/g     替换当前行第一个/后的关键字为第二个（单行）
%s/123/321/g    替换全文

" 批量操作
:1,29s/^#//     取消1-29行的注释

" 修改 SSH 配置
sed -i 's/#PermitRootLogin prohibit-password/PermitRootLogin yes/' /etc/ssh/sshd_config
sed -i 's/PasswordAuthentication no/PasswordAuthentication yes/' /etc/ssh/sshd_config
```

### 1.2 文件与目录操作

```bash
touch 文件名                     # 创建文件
mkdir 目录名                     # 创建目录
cd 目录                          # 切换目录
rm -rf 目录或文件名               # 强制删除
cp 文件 路径/xx.bak              # 复制+备份
mv 文件 路径                     # 移动文件
mv 旧文件名 新文件名              # 重命名
touch {1..3}.txt                 # 一次创建多个文件
touch `date +%F`                 # 以日期为文件名创建文件
touch `date +%Y-%m-%d-%H-%M-%S`  # 以年月日时分秒为文件名
```

### 1.3 文件查看

```bash
cat 文件名           # 查看全文
head -3 文件名       # 查看前3行（从上往下）
tail -20 文件名      # 查看后20行（从下往上）
tail -f 文件名       # 动态查看尾部（实时日志）
tailf 文件名         # 同 tail -f
more 文件名          # 分页查看，空格翻页（显示进度%）
less 文件名          # 分页查看，空格翻页，q退出
man 命令             # 查看帮助手册
```

### 1.4 系统信息

```bash
cat /etc/system-release    # 查看系统版本
uname -r                   # 查看内核版本
uname -a                   # 查看完整系统信息
hostname                   # 查看主机名
hostnamectl set-hostname xx  # CentOS8 永久修改主机名
date                       # 查看系统时间
date 010100012020          # 修改为 2020年1月1日0点01分
```

### 1.5 文件属性与链接

```bash
# 文件类型
d  目录    f  文件    l  链接    b  块设备    c  字符设备    s  套接字

# inode
ls -i    # 查看文件 inode 编号
df -i    # 查看 inode 使用情况

# 硬链接与符号链接
ln 源文件 链接文件          # 硬链接（不创建新inode，删除源文件后仍可用）
ln -s 源文件 链接文件        # 符号链接（创建新inode，删除源文件后失效）

# 特殊属性
chattr +i 文件名             # 添加只读属性（不能删除和修改）
chattr -i 文件名             # 移除只读属性
lsattr 文件名                # 查看文件属性
lsattr -d 目录名             # 查看目录属性
```

### 1.6 文件大小与磁盘

```bash
du -sh 文件名           # 查看文件/目录大小
du -sh *                # 查看当前目录下所有文件大小
lsblk                   # 查看分区
blkid                   # 查看设备 UUID
df -Th                  # 查看文件系统挂载及类型
```

### 1.7 Alias 别名

```bash
alias [name[=value]]         # 定义别名
unalias 别名                  # 取消别名
alias                        # 查看所有别名

# 常用示例
alias ll='ls -l'
alias grep='grep --color=auto'
alias ..='cd ..'
alias ...='cd ../..'
alias lls='ls -l;ls -a'

# 永久保存：写入 ~/.bashrc 或 ~/.bash_profile
echo "alias ll='ls -l'" >> ~/.bashrc
```

> ⚠️ 不要使用危险别名，如 `alias ls='rm -rf'`，会导致误删。

### 1.8 重定向

```bash
echo "内容" > 文件       # 覆盖写入（文件不存在会自动创建）
1>&2                     # 标准输出重定向到标准错误输出
```

### 1.9 文件查找 find

#### 基本查找

```bash
find /tmp/ -name "1.txt"              # 按文件名查找
find /tmp/ -iname "file1"             # 不区分大小写（-iname）
find /tmp/ -type f                    # 查找所有文件
find /tmp/ -type d                    # 查找所有目录
find /tmp/ -perm 755                  # 按权限查找（目录755，文件644）
find /tmp/ -size 1M                   # 按大小查找
find . -empty                         # 查找空文件（等同于 -size 0）
find . -size +1k -a -size -10k        # 查找大于1k小于10k（-a 且）
find . -name "1" -o -name "2"         # 查找名含"1"或"2"（-o 或）
find /tmp/ ! -name "1.txt"            # 排除指定文件（! 取反）
```

#### 时间查找

```bash
# -mtime 修改内容时间  -ctime 修改属性时间  -atime 访问时间
find /tmp/ -mtime -10     # 10天内修改过的文件
find /tmp/ -mtime 0       # 24小时内修改过的文件
```

#### 查找后处理

```bash
# 使用 -exec（每个文件启动一次命令，效率低）
find /tmp/ -name "*.txt" -exec rm -rf {} \;      # 查找并删除
find /tmp/ -size 1M -exec cp -rf {} /srv/ \;     # 查找并拷贝指定大小文件

# 使用 xargs（效率更高，但不能处理含空格的文件名）
find /tmp/ -name "1.txt" | xargs rm -rf           # 查找并删除
find /tmp/ -name "*.txt" | xargs tar czf `date +%F`.tar.gz    # 查找并打包

# -exec vs xargs 区别
# -exec：每处理一个文件启动一次命令，格式麻烦，必须用 {} 和 \;
# xargs：效率高，但不能操作文件名有空格的文件
```

### 1.10 压缩与归档

```bash
# tar
tar czf 包名.tar.gz 源文件/目录            # 打包压缩
tar xzf 包名.tar.gz                        # 解压到当前
tar xzf 包名.tar.gz -C /指定路径           # 解压到指定路径
tar tf 包名.tar.gz                         # 不解压直接查看内容
```

### 1.11 SCP 与 Rsync

```bash
scp 文件 IP:/路径                          # 发送文件
scp -r 目录 IP:/路径                       # 发送目录
scp IP:/路径/文件 /本地路径                # 取回文件
# ⚠️ scp 不支持断点续传，大文件用 rsync
```

### 1.12 Wget 与 Curl

```bash
wget URL                                   # 下载
wget -O 路径/文件名 URL                    # 下载并指定文件名
wget -c URL                                # 断点续传

curl -O URL                                # 下载到当前目录
curl -o 路径/文件名 URL                    # 下载到指定路径
curl -I URL                                # 查看 HTTP 响应头
curl -s -w '...' -o /dev/null URL          # 测试网站响应时间
```

### 1.13 计划任务

```bash
# crontab 格式: 分 时 日 月 周
crontab -e                  # 编辑
crontab -l                  # 查看
crontab -r                  # 删除

# 示例
0 2 * * 5 /usr/bin/touch /tmp/1.txt         # 每周五凌晨2点
0 */2 * * * /usr/bin/touch /tmp/1.txt       # 每2小时
0 2 14 * * /usr/sbin/shutdown now           # 每月14号2点关机

# 为指定用户
crontab -u jack -e

# 一次性任务
at now +1min                 # 1分钟后执行（Ctrl+D保存）
at 11:45 < at.jobs           # 批量执行

# 常见问题：计划任务不执行 → 检查 date、路径、crond进程
# 计划任务无法识别反引号`` → 改用脚本执行
```

### 1.14 随机密码生成

```bash
< /dev/urandom tr -dc a-z | head -c ${1:-32} ; echo         # 32位小写字母
< /dev/urandom tr -dc A-Z | head -c ${1:-10} ; echo         # 10个大写字母
< /dev/urandom tr -dc 0-9 | head -c ${1:-10} ; echo         # 10个数字
< /dev/urandom tr -dc 0-9A-Z | head -c ${1:-10} ; echo      # 10个数字+大写字母
```

### 1.15 实用一行命令

```bash
# TCP 各状态统计
netstat -n | awk '/^tcp/ {++y[$NF]} END {for(w in y) print w, y[w]}'

# grep 过滤含指定关键字的文件
grep 关键字 * -R

# AWK 输出指定行
grep IP * -R | awk -F : '{print $1}' | uniq -c | awk 'NR==2{print $2}'

# sed 替换
sed -r 's#原字符串#新字符串#' 文件

# sort 排序
sort -t":" -k3 -n /etc/passwd              # 按UID排序（-r倒序）
```

### 1.16 MD5 校验

```bash
# Linux
md5sum 文件名

# Windows CMD
certutil -hashfile 文件名 MD5

# Mac
md5 文件名
md5 -r 文件名              # 输出Linux格式
md5 -s "字符串"             # 计算字符串MD5
```

### 1.17 tcpdump 抓包

```bash
tcpdump -i eth0 -nn port 80                                           # 抓80端口
tcpdump -i eth0 udp port xxx                                          # 抓UDP
tcpdump -i eth0 -nn port 22 and src host 192.168.20.100              # 指定来源
tcpdump -i eth0 dst 192.168.100.100 and tcp port 9080                # 指定目标
tcpdump -i eth0 -tnn dst port 80 -c 1000 | awk -F "." '{print $1"."$2"."$3"."$4}' | sort | uniq -c | sort -nr | head -20  # 分析访问频率

# 使用 Wireshark 分析抓包文件
```

### 1.18 压力测试

```bash
ab -n 1000 -c 10 http://xxx.xxx.xxx.xxx/       # Apache Bench
stress -c 2 --timeout 600                       # CPU 压力测试
```

### 1.19 小工具

```bash
nethogs                   # 检测进程网速
hcache                    # 检查 buffer/cache 中的文件
```

---

## 二、用户与权限管理

### 2.1 用户管理

```bash
useradd 用户名                   # 创建用户
useradd -r 用户名 -M -s /bin/false  # 创建系统用户（不能登录）
passwd 用户名                    # 修改密码
userdel -r 用户名                # 删除用户及家目录
cat /etc/passwd | wc -l         # 查看系统用户数量
su 用户名                        # 切换用户（保留原环境）
su - 用户名                      # 完全切换用户（加载目标用户环境）
```

### 2.2 权限管理

```bash
chmod u+x file1.txt              # 属主增加执行权限
chmod a=rwx file1.txt            # 所有人读写执行
chmod a=- file1.txt              # 所有人都没有权限
chmod ug=rw,o=r file1.txt        # 属主属组读写，其他人只读

chown 属主:属组 文件             # 更改文件所属
chown -R 属主:属组 目录          # 递归更改目录所属
chgrp 组名 文件                  # 更改属组
```

### 2.3 umask 权限掩码

```
文件默认权限 = 0666 - umask
目录默认权限 = 0777 - umask

root 用户 umask：0022  →  文件644  目录755
普通用户 umask：0002  →  文件664  目录775
```

### 2.4 sudo 提权

```bash
# 方法一：/etc/sudoers.d/ 下创建用户文件（推荐）
useradd jumper
echo "jumper ALL=(ALL) NOPASSWD: ALL" > /etc/sudoers.d/jumper

# 方法二：加入 wheel 组
useradd 用户名 -G wheel

# 方法三：直接编辑 /etc/sudoers，取消 wheel 行注释
# %wheel ALL=(ALL) NOPASSWD:ALL
```

### 2.5 环境变量

```bash
# 在 /etc/profile.d/ 下创建 .sh 文件写入环境变量（推荐，不修改系统文件）
vim /etc/profile.d/myenv.sh
source /etc/profile
```

---

## 三、进程管理

### 3.1 查看进程

```bash
ps aux | less                  # 查看所有进程
ps -ef | less                  # 查看进程及父子关系
ps aux --sort -%cpu | less     # 按CPU使用率排序
ps aux --sort -%mem | less     # 按内存使用率排序
ps aux | grep gedi[t]          # [t]技巧避免grep自身出现
top                            # 动态查看
    # top快捷键: h帮助 >下翻 <上翻 M按内存 P按CPU q退出 z彩色 1查看每核CPU W保存
```

### 3.2 进程信号

| 信号 | 编号 | 作用 |
|------|------|------|
| HUP  | -1   | 重新加载（PID不变） |
| KILL | -9   | 强制杀死 |
| TERM | -15  | 正常终止（默认） |
| CONT | -18  | 激活进程 |
| STOP | -19  | 挂起进程 |

```bash
kill -9 PID           # 强制杀死指定进程
pkill 服务名          # 批量杀死
pkill -u 用户名       # 踢出用户
killall 进程名        # 杀死所有同名进程
lsof -p PID           # 查看进程占用的文件
lsof -i:端口号        # 查看端口被哪个进程占用
```

### 3.3 进程状态

| 状态 | 含义 |
|------|------|
| R    | 运行中（Running） |
| S    | 可中断睡眠（Sleep） |
| D    | 不可中断睡眠（Disk Sleep） |
| T    | 停止（Stopped） |
| Z    | 僵尸进程（Zombie） |
| X    | 死掉的进程 |

```bash
ps aux | awk '{print $8}' | grep Z | wc -l    # 查看僵尸进程数量
```

**僵尸进程**：子进程结束但父进程未回收 → 占用进程号 → 系统无法创建新进程。

**孤儿进程**：父进程结束但子进程还在 → 由 init(PID=1) 回收 → 不占用资源。

### 3.4 CPU 上下文切换

- **CPU 寄存器**：CPU 内置的高速小容量内存。
- **程序计数器(PC)**：存储 CPU 正在执行或即将执行的指令位置。
- **上下文切换**：保存前一个任务的上下文 → 加载新任务 → 跳转到新位置运行。

三种类型：**进程上下文切换**、**线程上下文切换**、**中断上下文切换**。

### 3.5 Nice 优先级

- Nice 值范围：**-20 ~ +19**
- Nice 值越高 → 优先级越低（更容易让出 CPU）
- Nice 值越低 → 优先级越高（更不容易让出 CPU）

```bash
ps -l     # 查看 NI 列
nice -n 优先级 命令       # 以指定优先级启动进程
renice 优先级 -p PID      # 调整已有进程优先级
```

---

## 四、系统信息与监控

### 4.1 系统目录结构

| 目录 | 用途 |
|------|------|
| `/` | 根目录 |
| `/usr/` | 系统应用存储目录 |
| `/etc/` | 系统配置文件 |
| `/tmp/` | 临时文件 |
| `/home/` | 普通用户家目录 |
| `/root/` | root 用户家目录 |
| `/dev/` | 设备目录 |
| `/var/` | 系统日志 |
| `/boot/` | 引导程序、内核 |
| `/proc/` | 伪文件系统（进程、内核参数） |
| `/sys/` | 伪文件系统 |
| `/opt/` | 第三方软件 |
| `/srv/` | 服务数据 |

### 4.2 重要配置文件速查

| 文件 | 作用 |
|------|------|
| `/etc/fstab` | 开机自动挂载 |
| `/etc/rc.local` | 开机自启动脚本 |
| `/etc/hostname` | 主机名 |
| `/etc/hosts` | 本地域名解析 |
| `/etc/resolv.conf` | DNS 地址 |
| `/etc/exports` | NFS 主配置 |
| `/etc/cron.deny` | 禁止创建计划任务的用户 |

### 4.3 系统启动流程

```
加电 → BIOS → GRUB → 加载内核 → 加载配置文件 → 
加载内核模块 → 初始化服务 → 启动 systemd(PID=1) → login 界面
```

**关键进程**：`systemd` (PID=1 负责启动其他程序)、`kthreadd` (PID=2 内核线程管理)。

### 4.4 系统运行级别

| 级别 | 含义 |
|------|------|
| 0 | 关机 |
| 1 | 单用户模式（root 权限，禁止远程登录） |
| 2 | 多用户模式（无 NFS） |
| 3 | 完整多用户文本模式（常用服务器模式） |
| 4 | 保留 |
| 5 | 图形化模式 |
| 6 | 重启 |

### 4.5 系统监控命令

```bash
# CPU
cat /proc/cpuinfo                     # CPU 型号及核心数

# 内存
free -m                               # 内存（MB）
free -h                               # 内存（人类可读）
cat /proc/meminfo | awk '{print $1,$2/1024" MB"}'|column -t  # 详细内存

# 负载
top / w / uptime                      # 查看平均负载 (load average)
watch -d -n1 uptime                   # 高亮显示变化
mpstat -P ALL 5                       # 监控所有CPU，间隔5秒
pidstat -u 5 1                        # 5秒后输出1组，查看哪个进程CPU高

# 综合
vmstat 1 5                            # 采样间隔1秒，采样5次
# r: run队列  b: block阻塞  swpd: swap使用  si/so: swap进出
# bi/bo: 磁盘读写  us: 用户CPU%  wa: IO等待%
```

### 4.6 重要参数文件

```bash
cat /proc/cpuinfo                     # CPU 信息
cat /proc/meminfo                     # 内存详情
echo 3 > /proc/sys/vm/drop_caches     # 清除缓存
cat /proc/sys/vm/vfs_cache_pressure   # 回收缓存的倾向（默认100）
```

### 4.7 CentOS 6 vs 7

| 对比项 | CentOS 6 | CentOS 7 |
|--------|----------|----------|
| 防火墙 | iptables | firewalld |
| 默认数据库 | MySQL | MariaDB |
| 服务管理 | service xx restart | systemctl restart xx |
| 启动加载器 | SysV init | systemd |

---

## 五、磁盘与文件系统

### 5.1 分区

```bash
fdisk /dev/sdb       # MBR 分区（≤2TB，最多4主分区）
gdisk /dev/sdb        # GPT 分区（>2TB，最多128主分区）
lsblk                  # 查看分区结果
```

**MBR vs GPT**：MBR 最大支持 2TB、4 个主分区；GPT 支持更大容量、更多分区，配合 UEFI 启动。

### 5.2 格式化与挂载

```bash
# 格式化
mkfs.xfs /dev/sdb -f             # 格式化为 XFS
mkfs.ext4 /dev/sdb               # 格式化为 ext4

# 临时挂载（重启失效）
mount /dev/sdb /mnt/d1
umount /dev/sdb /mnt/d1

# 永久挂载 /etc/fstab
# UUID=xxx  /mnt/d1  xfs  defaults  0  0
mount -a                         # 检测 fstab 是否有误
```

### 5.3 ext4 vs XFS

| 对比 | ext4 | XFS |
|------|------|-----|
| inode | 创建时固定数量，消耗完不能创建文件 | 动态产生 |
| 容量 | 较小 | 支持 >16TB |
| 格式化速度 | 慢 | 快 |
| 修复速度 | 慢 | 快 |
| 适用 | 兼容性广 | 大存储、高性能 |

### 5.4 XFS 修复

```bash
xfs_check /dev/sdd; echo $?      # 检查文件系统（需 umount）
# 返回 0 表示正常
```

### 5.5 Swap 分区

| 内存大小 | 推荐 Swap |
|----------|------------|
| < 4GB | ≥ 2GB |
| 4~16GB | ≥ 4GB |
| 16~64GB | ≥ 8GB |
| 64~256GB | ≥ 16GB |

```bash
dd if=/dev/zero of=/swap2.img bs=1M count=1024    # 创建1G测试数据
```

### 5.6 磁盘 I/O 监控

```bash
iostat -xk 1          # 每秒获取磁盘 IO 信息（-k以KB显示）
pidstat -d 1          # 检查磁盘使用情况
iotop -o -d 5         # 仅显示有IO的进程，刷新间隔5秒
iotop -oP             # -o累计模式 -P按进程显示
```

**磁盘瓶颈 5 大指标**：使用率(%util)、饱和度、IOPS(r/s+w/s)、吞吐量(rkB/s+wkB/s)、响应时间(r_await+w_await)。

---

## 六、LVM 逻辑卷管理

### 6.1 核心概念

```
PV（物理卷） → VG（卷组） → LV（逻辑卷）
```

**注意**：PV 不能跨越 VG，LV 不能跨越 VG，一个系统可创建多个 VG，一个 VG 可创建多个 LV。

### 6.2 创建 LVM

```bash
# 1. 创建 PV
pvcreate /dev/sdb
pvs / pvscan                   # 查看 PV

# 2. 创建 VG
vgcreate datavg /dev/sdb
vgs / vgscan                   # 查看 VG

# 3. 创建 LV
lvcreate -L 200M -n lv1 datavg
lvcreate -L 300M -n lv2 datavg
lvs / lvscan                   # 查看 LV

# 4. 格式化并挂载
mkfs.xfs /dev/datavg/lv1
mkfs.ext4 /dev/datavg/lv2
mkdir /mnt/lv1 /mnt/lv2
mount /dev/datavg/lv1 /mnt/lv1
mount /dev/datavg/lv2 /mnt/lv2
```

### 6.3 VG 扩容与缩小

```bash
# 扩容 VG
pvcreate /dev/sdc
vgextend datavg /dev/sdc

# 数据迁移（从旧盘迁到新盘）
pvmove /dev/sdb /dev/sdc

# 缩小 VG（先迁移数据）
vgreduce datavg /dev/sdb

# LV 扩容
lvextend -L +5G /dev/centos/root
# XFS 文件系统整合（必须执行）
xfs_growfs /dev/centos/root

# LV 缩小（慎用！可能损坏数据）
lvreduce -L 80M /dev/datavg/lv1
```

### 6.4 删除 LVM（顺序：LV → VG → PV）

```bash
lvremove /dev/vg2/lv2      # 先删除 LV（需先 umount）
vgremove /dev/vg2           # 再删除 VG
pvremove /dev/sdc           # 最后删除 PV
```

---

## 七、RAID 磁盘阵列

### 7.1 RAID 级别对比

| RAID | 最少盘数 | 利用率 | 容错 | 特点 |
|------|----------|--------|------|------|
| RAID 0 | 2 (全盘0) / 1 (单盘0) | 100% | 无 | 读写快，无容错 |
| RAID 1 | 2 | 50% | 1块 | 镜像，读快写慢，常用于系统盘 |
| RAID 5 | 3 | (n-1)/n | 1块 | 读写均衡 |
| RAID 6 | 4 | (n-2)/n | 2块 | 双重校验，写慢 |
| RAID 1+5 | — | — | — | 机械盘 RAID1 装系统 + 固态盘 RAID5 存数据 |

### 7.2 磁盘状态

| 状态 | 含义 |
|------|------|
| Online | 正常在线 |
| Failed | 故障（亮红灯） |
| Rebuild | 正在重建同步 |
| Ready | 未加入阵列 |
| Foreign | 未知残留数据（需 Clear 后变为 Ready） |

### 7.3 DELL 服务器 RAID 操作

- 进入 RAID 卡：重启时按 **Ctrl+R**
- Foreign 状态处理：切到 Foreign 栏 → F2 → Clear
- 磁盘槽位：DELL 从 Slot 0 开始，HP/H3C/浪潮等可能从 Slot 1 开始

### 7.4 更换硬盘流程

1. 确认故障盘型号（容量、转速、接口、尺寸）
2. 新盘做检测，清除数据至 Ready 状态
3. 发到 IDC 机房，附带工单（机房位置+服务器名+Slot ID）
4. 工程师更换后确认状态 → 工单关闭
5. 旧盘单独存放，定期销毁

---

## 八、网络管理

### 8.1 基础命令

```bash
ip a / ifconfig                  # 查看 IP（ifconfig 可看到 RX/TX 流量）
curl ifconfig.me                 # 查看公网 IP
route -n                         # 查看网关
ping -c 10000 -i 0.01 IP地址     # 快速发包测试丢包率
ethtool eth0                     # 查看网卡协商速率
lspci | grep -i ethernet         # 查看网卡硬件信息
```

### 8.2 网络诊断思路

```
ifconfig 看 RX/TX:
  发包大收包小 → 网卡没问题，问题在上一级网络
  发包小收包大 → 网卡出问题或遭受攻击

看 error 和 drop:
  数值大 → 网络质量差 → 换网线/查带宽/查网卡驱动/查攻击
```

**判断是服务器问题还是链路问题**：
1. `ip a` 确认 IP 段 → 2. 笔记本直连服务器 → 3. 笔记本配同段 IP ping 服务器 → 4. 通则服务器没问题 → 5. 把服务器网线插笔记本验证链路。

### 8.3 网卡配置

```bash
# 网卡配置文件: /etc/sysconfig/network-scripts/ifcfg-ens33
TYPE=Ethernet
BOOTPROTO=none          # none=静态 dhcp=动态
NAME=ens33
DEVICE=ens33
ONBOOT=yes
IPADDR=192.168.10.20
PREFIX=24                # 或 NETMASK=255.255.255.0
GATEWAY=192.168.10.1
DNS1=8.8.8.8

# CentOS8 生效配置
nmcli c reload
nmcli c up ens33
```

### 8.4 子接口配置

```bash
# 复制网卡配置文件，修改设备名和IP
cp ifcfg-ens33 ifcfg-ens33:0
# 修改 DEVICE=ens33:0, NAME=ens33:0, IPADDR=新IP
systemctl restart network
```

### 8.5 网卡重命名 (ens33 → eth0)

```bash
vim /etc/sysconfig/grub
# GRUB_CMDLINE_LINUX="crashkernel=auto rhgb net.ifnames=0 biosdevname=0 quiet"
grub2-mkconfig -o /boot/grub2/grub.cfg
reboot
```

### 8.6 Bond 网卡绑定

**Bond 模式**：常用 mode=4（动态链接聚合 LACP），其他如 mode=0（平衡轮循）、mode=1（主备）。

```bash
# 1. 创建 bond0 配置文件
vim /etc/sysconfig/network-scripts/ifcfg-bond0
DEVICE=bond0
TYPE=Ethernet
ONBOOT=yes
BOOTPROTO=none
IPADDR=192.168.x.x
PREFIX=24

# 2. 从属网卡加入 bond
vim ifcfg-ens33
DEVICE=ens33
MASTER=bond0
SLAVE=yes

# 3. bonding 参数
vim /etc/modprobe.d/bond0.conf
alias bond0 bonding
options bonding mode=4 miimon=100

# 4. 重启网络
systemctl restart network
```

### 8.7 解决网卡乱序

方法：进入 BIOS 拍照 MAC 地址 → 在网卡配置文件中绑定 MAC

```bash
# 在配置文件中添加
HWADDR=52:54:00:9e:d5:4d
```

### 8.8 端口与连接

```bash
ss -tnlp                          # 查看 TCP 监听端口（比 netstat 快）
netstat -tnlp                     # 查看 TCP 监听端口
netstat -unlp                     # 查看 UDP 监听端口
netstat -nat | grep ESTABLISHED | wc -l         # 当前连接数
netstat -n | awk '/^tcp/ {++y[$NF]} END {for(w in y) print w, y[w]}'  # 各状态连接数
netstat -natlp | grep "tcp" | awk '{print$5}' | awk -F: '{print$1}' | sort | uniq -c | sort -rn  # 客户端 IP 连接数排名
```

**ss vs netstat**：ss 直接读 `/proc/net`，利用内核 `tcp_diag` 模块获取第一手信息，比 netstat 遍历 `/proc/PID` 快得多。

### 8.9 路由

```bash
route -n                                    # 查看路由表
route add -p IP mask 掩码 网关              # 添加临时路由（Windows）
route add -net 192.168.8.0/8 gw 10.0.0.1   # Linux 添加路由
# 永久路由写入 /etc/rc.local
```

### 8.10 防火墙

```bash
systemctl status firewalld       # 查看状态
systemctl stop firewalld         # 临时关闭
systemctl disable firewalld      # 永久关闭（重启生效）
setenforce 0                     # 临时关闭 SELinux
vim /etc/selinux/config          # enforcing → disabled（永久关闭）

# iptables
iptables -L -n --line-numbers    # 按编号查看规则
iptables -D INPUT 6              # 删除第6条规则
```

### 8.11 SSH

```bash
# 免密登录
ssh-keygen                        # 生成密钥对（三下回车）
ssh-copy-id -i 目标IP             # 拷贝公钥到目标机器
ssh 目标IP                        # 免密登录

# 修改 SSH 端口
vim /etc/ssh/sshd_config
Port 1000
systemctl restart sshd
# 注意：云服务器需先在安全组放行新端口

# 远程执行命令
ssh 8.130.28.48 'ps -aux'
```

### 8.12 DNS

| 记录类型 | 作用 |
|----------|------|
| A | 域名 → IPv4 |
| AAAA | 域名 → IPv6 |
| CNAME | 别名（域名 → 域名） |
| MX | 邮件服务器 |
| NS | 名称服务器 |
| SOA | 起始授权结构 |
| PTR | 反向解析（IP → 域名） |

```bash
dig 域名                     # DNS 查询工具
vim /etc/resolv.conf         # 修改 DNS
# TTL: 域名解析结果可缓存的最长时间
```

### 8.13 TCP Wrappers

优先级：`/etc/hosts.allow` > `/etc/hosts.deny`，都未匹配则默认放行。

```bash
# /etc/hosts.deny
sshd:ALL                     # 拒绝所有
sshd:192.168.246.159         # 拒绝特定 IP
```

### 8.14 常用端口与服务

```bash
netstat -tnlp                 # 开放的 TCP 端口
netstat -unlp                 # 开放的 UDP 端口
lsof -i:端口号                # 查看端口调用的文件和进程
```

### 8.15 丢包测试

```bash
ping -c 10000 -i 0.01 IP地址    # 发10000个包，间隔0.01秒
# 看丢包率: 0% packet loss 表示不丢包
# 在公司中服务器网关是 X.X.X.1，虚拟机是 X.X.X.2
```

---

## 九、交换机配置

### 9.1 Cisco VLAN 模板

```cisco
enable
configure terminal

vlan 25
interface FastEthernet0/1
switchport mode access
switchport access vlan 25
no shutdown

end
write
```

### 9.2 Cisco Bond 模板

```cisco
enable
configure terminal

vlan 100
interface port-channel1
switchport mode access
switchport access vlan 100

interface FastEthernet0/4
switchport mode access
switchport access vlan 100
channel-group 1 mode on

interface FastEthernet0/8
switchport mode access
switchport access vlan 100
channel-group 1 mode on

end
write
```

```cisco
" 查看命令
show ip interface brief          " 查看接口状态
show vlan brief                  " 查看 VLAN
show etherchannel summary        " 查看聚合组
```

### 9.3 H3C VLAN 模板

```h3c
system-view

vlan 348
interface GigabitEthernet1/0/4
port link-mode bridge
port access vlan 348
undo shutdown

quit
save
```

### 9.4 H3C Bond 模板

```h3c
system-view

vlan 335
interface Bridge-Aggregation1
port access vlan 335
exit
interface GigabitEthernet1/0/17
 port link-mode bridge
 port access vlan 335
 port link-aggregation group 1
interface GigabitEthernet1/0/18
 port link-mode bridge
 port access vlan 335
 port link-aggregation group 1

quit
save
```

```h3c
" 查看命令
display interface brief                      " 查看接口状态
display vlan / display vlan all               " 查看 VLAN
display link-aggregation verbose Bridge-Aggregation  " 查看聚合端口
```

### 9.5 网络常识

- **二层交换机**：数据链路层设备，按 MAC 地址转发（服务器机柜上）。
- **三层交换机**：有路由功能，可跑协议（机房核心交换机）。
- **VLAN**：虚拟局域网，控制广播、提高安全性，同 VLAN 才能通信。
- 网线线序 568B：橙白 橙 绿白 蓝 蓝白 绿 棕白 棕（数据传输用 1、2、3、6 脚）。
- 光口交换机 → 光纤 → 万兆光模块 → 万兆网卡 → 服务器。

---

## 十、软件包管理

### 10.1 YUM

```bash
# 换阿里源
curl -o /etc/yum.repos.d/CentOS-Base.repo http://mirrors.aliyun.com/repo/Centos-7.repo
yum -y install epel-release          # 安装 EPEL 扩展源

# 基本操作
yum clean all                         # 清除缓存
yum makecache                         # 缓存软件包信息
yum repolist                          # 查询 yum 源
yum search 关键词                     # 搜索软件
yum provides 命令                     # 查命令属于哪个包
yum list                              # 列出所有软件

# 安装/卸载
yum -y install 包名                   # 安装（-y跳过确认）
yum -y remove 包名                    # 卸载
yum -y erase 包名                     # 卸载（CentOS8）
yum -y reinstall 包名                 # 重装
yum -y remove `rpm -qa | grep httpd`  # 批量卸载相关包

# 跳过公钥检查
yum install xxx --nogpgcheck
```

### 10.2 挂载 ISO 作为 YUM 源

```bash
mkdir -p /mnt/kylin-iso
mount -o loop -t iso9660 /root/Kylin-Server-V10-SP3.iso /mnt/kylin-iso
cd /etc/yum.repos.d/
mkdir bak && mv *.repo bak/

vim /etc/yum.repos.d/kylin-local.repo
[kylin-local]
name=Kylin V10 Local ISO Repository
baseurl=file:///mnt/kylin-iso
enabled=1
gpgcheck=0
```

### 10.3 RPM

```bash
rpm -ivh 包名                # 安装
rpm -q 包名                  # 查询是否安装
rpm -qa | grep 关键词        # 模糊搜索已安装
rpm -e 包名                  # 卸载

# RPM vs YUM：rpm 不处理依赖，yum 自动解决依赖。
```

### 10.4 源码编译安装

```bash
# 通用流程
tar xzf xxx.tar.gz
cd xxx
./configure --prefix=/usr/local/xxx
make
make install

# 如果缺少依赖：
./configure --prefix=/usr/local/a --with-b=/usr/local/b --with-c=/usr/local/c
```

### 10.5 安装方式对比

| 方式 | 适用场景 | 特点 |
|------|----------|------|
| RPM | 银行、国企等无公网环境 | 需手动处理依赖 |
| YUM | 有公网 | 自动处理依赖，最方便 |
| 源码编译 | 需要特定版本的场景 | 最稳定，但耗时长 |

### 10.6 互传工具

```bash
yum -y install lrzsz       # 安装 rz/sz
rz                         # Windows → Linux（回车选择文件）
sz 文件名                  # Linux → Windows
```

---

## 十一、服务与中间件

### 11.1 systemctl 服务管理

```bash
systemctl status 服务名       # 查看状态
systemctl restart 服务名      # 重启
systemctl stop 服务名         # 停止
systemctl enable 服务名       # 开机自启动
systemctl disable 服务名      # 禁止自启动
systemctl list-unit-files --state=enabled | grep nginx   # 查看已启用的服务
```

### 11.2 时间同步

```bash
# CentOS 7
yum -y install ntp
ntpdate -s pool.ntp.org

# CentOS 8 (使用 chrony)
vim /etc/chrony.conf
server 210.72.145.44 iburst
server ntp.aliyun.com iburst
systemctl restart chronyd.service
chronyc sources -v
```

### 11.3 HTTPD (Apache)

```bash
yum -y install httpd
systemctl restart httpd
```

**虚拟主机**：
- 基于端口：一个 IP 开放多个端口（如 80、1000、2000）
- 基于 IP：多个 IP 共用一个端口

```apache
# /etc/httpd/conf.d/void.conf
<VirtualHost *:80>
    ServerName www.example.com
    ServerAlias example.com
    DocumentRoot /web/example
</VirtualHost>
<Directory "/web/example">
    Require all granted
</Directory>

# 添加监听端口
# vim /etc/httpd/conf/httpd.conf
Listen 1000
```

### 11.4 搭建 WordPress 博客

```bash
# 安装环境
yum -y install mariadb mariadb-server mariadb-libs php php-mysql php-gd php-fpm php-cli gd httpd

# 数据库
systemctl restart mariadb
mysqladmin -uroot password "123"
mysql -uroot -p123 -e "CREATE DATABASE boke; FLUSH PRIVILEGES;"

# 部署源码
mkdir -p /web/tianyun
tar xzf wordpress-4.7.2-zh_CN.tar.gz
cp -rf wordpress/* /web/tianyun/
chmod -R 777 /web/

# 配置虚拟主机后重启
systemctl restart httpd
```

### 11.5 Nginx

```bash
# 源码编译安装
./configure --prefix=/usr/local/nginx
make && make install
/usr/local/nginx/sbin/nginx                  # 启动
/usr/local/nginx/sbin/nginx -s stop          # 停止
```

### 11.6 Nginx + GridFS 图片服务器

```bash
# MongoDB
vim /etc/yum.repos.d/mongodb-org-3.4.repo
[mongodb-org-3.4]
name=MongoDB Repository
baseurl=https://repo.mongodb.org/yum/redhat/$releasever/mongodb-org/3.4/x86_64/
gpgcheck=1
enabled=1
gpgkey=https://www.mongodb.org/static/pgp/server-3.4.asc

yum makecache && yum -y install mongodb-org
systemctl restart mongod

# 上传文件到 GridFS
mongofiles put --host 127.0.0.1 --port 27017 --db test 1.jpg --type jpg

# nginx-gridfs 插件编译
git clone https://github.com/rjhunjhunwla/nginx-gridfs
cd nginx-gridfs && git submodule init && git submodule update
cd nginx-1.7.4
./configure --add-module=../nginx-gridfs
make && make install

# nginx 配置
location /img/ {
    gridfs test field=filename type=string;
    mongo 127.0.0.1:27017;
}
```

### 11.7 FTP (vsftpd)

```bash
yum -y install vsftpd
systemctl restart vsftpd
# 共享目录: /var/ftp/

# 客户端 (lftp)
yum -y install lftp
lftp IP地址
get 文件 -o /tmp/       # 下载到指定路径
put 文件                 # 上传
mirror 目录              # 下载目录

# 匿名用户上传配置
anon_upload_enable=YES
anon_mkdir_write_enable=YES
anon_other_write_enable=YES
chmod -R 777 /var/ftp/
```

**FTP 工作模式**：主动模式 / 被动模式，使用 20（数据）、21（控制）端口。

### 11.8 NFS 网络文件系统

```bash
# 服务端
yum -y install nfs-utils
mkdir /webdata
echo "hello" > /webdata/index.html
vim /etc/exports
/webdata  192.168.15.0/24(rw,sync,no_root_squash)
systemctl restart nfs
exportfs -v                   # 查看共享目录

# 客户端
yum -y install nfs-utils httpd
showmount -e 服务端IP
mount -t nfs 服务端IP:/webdata /var/www/html/

# 永久挂载 (/etc/fstab)
服务端IP:/webdata  /var/www/html  nfs  defaults  0  0
```

---

## 十二、数据库 MySQL/MariaDB

### 12.1 常用命令

```sql
-- 登录
mysql -u 用户名 -h IP地址 -P 3306 -p

-- 用户管理
DROP USER 'test1'@'%';
GRANT ALL ON *.* TO 'test1'@'%' IDENTIFIED BY 'Password' WITH GRANT OPTION;
FLUSH PRIVILEGES;

-- 修改密码
update mysql.user set authentication_string=PASSWORD('新密码') where User='root';
-- MariaDB
alter user 'root'@'localhost' identified by '新密码';
SET PASSWORD FOR 'root'@'%' = PASSWORD('新密码');
```

### 12.2 MySQL 5.7 源码编译安装

```bash
# 1. 清理环境
yum erase mariadb mariadb-server mariadb-libs mariadb-devel -y
userdel -r mysql
rm -rf /etc/my* /var/lib/mysql

# 2. 创建用户
useradd -r mysql -M -s /bin/false

# 3. 下载
wget https://dev.mysql.com/get/Downloads/MySQL-5.7/mysql-boost-5.7.27.tar.gz

# 4. 编译工具
yum -y install ncurses ncurses-devel openssl-devel bison gcc gcc-c++ make cmake

# 5. 创建目录
mkdir -p /usr/local/{data,mysql,log}

# 6. 解压
tar xzvf mysql-boost-5.7.27.tar.gz -C /usr/local/

# 7. cmake 编译
cd /usr/local/mysql-5.7.27
cmake . \
-DWITH_BOOST=boost/boost_1_59_0/ \
-DCMAKE_INSTALL_PREFIX=/usr/local/mysql \
-DSYSCONFDIR=/etc \
-DMYSQL_DATADIR=/usr/local/mysql/data \
-DMYSQL_TCP_PORT=3306 \
-DMYSQL_UNIX_ADDR=/tmp/mysql.sock \
-DDEFAULT_CHARSET=utf8 \
-DEXTRA_CHARSETS=all \
-DDEFAULT_COLLATION=utf8_general_ci \
-DWITH_READLINE=1 \
-DWITH_SSL=system \
-DWITH_EMBEDDED_SERVER=1 \
-DENABLED_LOCAL_INFILE=1 \
-DWITH_INNOBASE_STORAGE_ENGINE=1

make && make install          # 约30分钟

# 8. 初始化
cd /usr/local/mysql
chown -R mysql.mysql .
./bin/mysqld --initialize --user=mysql --basedir=/usr/local/mysql --datadir=/usr/local/mysql/data
# 记住输出的临时密码！

# 9. 配置 my.cnf
vim /etc/my.cnf
[client]
port = 3306
socket = /tmp/mysql.sock
default-character-set = utf8

[mysqld]
port = 3306
user = mysql
basedir = /usr/local/mysql
datadir = /usr/local/mysql/data
socket = /tmp/mysql.sock
character_set_server = utf8

# 10. 启动
./bin/mysqld_safe --user=mysql &

# 11. 登录修改密码
/usr/local/mysql/bin/mysql -uroot -p'临时密码'
mysqladmin -u root -p'旧密码' password '新密码'

# 12. 环境变量
echo 'PATH=$PATH:$HOME/bin:/usr/local/mysql/bin' >> /etc/profile
source /etc/profile

# 13. 服务管理
cp /usr/local/mysql/support-files/mysql.server /etc/init.d/mysqld
chkconfig --add mysqld
chkconfig mysqld on
/etc/init.d/mysqld start
```

---

## 十三、TCP/IP 协议深入

### 13.1 TCP 三次握手

```
客户端                          服务端
  |-------SYN(seq=x)---------->|  SYN-SENT → SYN-RCVD
  |<---SYN+ACK(seq=y,ack=x+1)--|
  |-------ACK(ack=y+1)-------->|  ESTABLISHED
```

**为什么是三次？**
- 防止已失效的连接请求到达服务端，导致服务端错误建立连接（浪费资源）。
- 三次能确认双方收发能力正常。

**前两次握手不带数据**：防止 SYN Flood 攻击放大。

### 13.2 TCP 四次挥手

```
客户端                          服务端
  |-------FIN(seq=x)---------->|  FIN-WAIT-1 → CLOSE-WAIT
  |<------ACK(ack=x+1)---------|
  |                             |  (服务端继续发剩余数据)
  |<------FIN(seq=y)----------|  LAST-ACK
  |-------ACK(ack=y+1)-------->|  TIME-WAIT → CLOSED
```

**为什么是四次？** 服务端收到 FIN 后可能还有数据要发，ACK 和 FIN 分开发送。

### 13.3 TCP 11 种状态

| 状态 | 含义 |
|------|------|
| LISTEN | 监听连接请求 |
| SYN-SENT | 发送 SYN 后等待确认 |
| SYN-RECEIVED | 收到 SYN 后等待确认 |
| ESTABLISHED | 连接已建立 |
| FIN-WAIT-1 | 等待远程 TCP 中断确认 |
| FIN-WAIT-2 | 等待远程 TCP 中断请求 |
| CLOSE-WAIT | 等待本地用户中断请求 |
| CLOSING | 等待远程 TCP 中断确认 |
| LAST-ACK | 等待最终 ACK |
| TIME-WAIT | 等待足够时间（2MSL）确保远程收到确认 |
| CLOSED | 无连接 |

**TIME-WAIT 为何是 2MSL？** 保证两端未收到或迟到的报文都已消失。

**TIME-WAIT 过多的危害**：每个占用一个本地端口（上限 65535），端口耗尽则无法建立新连接。

### 13.4 SYN Flood 攻击

- 伪造大量不存在 IP 发送 SYN → 服务端大量 SYN-RCVD 占满半连接队列 → 无法处理正常请求。
- 防御：`net.ipv4.tcp_syncookies = 1` 启用 SYN Cookie。

### 13.5 OSI 七层模型

| 层 | 名称 | 协议 |
|----|------|------|
| 7 | 应用层 | HTTP, FTP, SMTP, DNS, Telnet, SNMP |
| 6 | 表示层 | 数据格式、加密、压缩 |
| 5 | 会话层 | 建立/管理/终止会话 |
| 4 | 传输层 | TCP, UDP |
| 3 | 网络层 | IP, ICMP, RIP, OSPF, BGP |
| 2 | 数据链路层 | ARP, MAC |
| 1 | 物理层 | 电缆、光纤、无线 |

**TCP/IP 四层模型**：数据链路层(1+2) → 网络层(3) → 传输层(4) → 应用层(5+6+7)

### 13.6 TCP vs UDP

| 对比 | TCP | UDP |
|------|-----|-----|
| 连接 | 面向连接 | 无连接 |
| 可靠性 | 可靠（确认+重传） | 不可靠 |
| 速度 | 慢 | 快 |
| 适用场景 | 文件传输、Web | 视频通话、直播、DNS |

### 13.7 IP 地址分类

| 类别 | 范围 | 默认掩码 |
|------|------|----------|
| A | 0.0.0.0 ~ 127.255.255.255 | /8 |
| B | 128.0.0.0 ~ 191.255.255.255 | /16 |
| C | 192.0.0.0 ~ 223.255.255.255 | /24 |
| D | 224.0.0.0 ~ 239.255.255.255 | 组播 |
| E | 240.0.0.0 ~ 254.255.255.255 | 保留 |

### 13.8 DNS 解析流程

```
浏览器输入URL → 查本地 hosts → 查本地DNS缓存 → 
查区域DNS → 逐级向上（根域 → 顶级域 → 权威DNS）→ 
返回IP给浏览器 → 浏览器发起HTTP请求
```

---

## 十四、性能调优

### 14.1 CPU 调优

```bash
stress -c 2 --timeout 600              # CPU 压力测试
mpstat -P ALL 5                        # 监控所有 CPU
pidstat -u 5 1                         # 定位高 CPU 进程

# 诊断思路：
# %usr 高 + iowait 低 → CPU 密集型，考虑升级 CPU
# %usr 低 + iowait 高 → IO 等待多，关闭不必要进程或迁移服务
```

### 14.2 内存调优

```bash
free -h                                # 查看内存
cat /proc/meminfo                      # 详细内存信息

# 建议：
# 1. 尽量禁止 Swap，或降低 swappiness
# 2. 调整核心应用 oom_score 防止被 OOM 杀死
```

### 14.3 磁盘 I/O 调优

1. 换用更快的磁盘（SSD 替代 HDD）
2. 使用 XFS 替代 ext4（更大容量、更高性能）
3. 调整 `vfs_cache_pressure`（默认100，越大越易回收）
4. 使用 RAID 提升读写性能和数据可靠性

### 14.4 内核参数调优 (sysctl.conf)

```bash
# 查看默认值并优化
sysctl -a | grep tcp

# Web 服务器推荐参数
net.ipv4.tcp_syncookies = 1            # 防御 SYN Flood
net.ipv4.tcp_max_syn_backlog = 8192    # SYN 队列长度（默认128）
net.core.somaxconn = 10240             # 完成连接队列上限（默认128）
net.core.rmem_max = 16777216           # Socket 接收缓存最大值
net.core.wmem_max = 16777216           # Socket 发送缓存最大值
net.core.rmem_default = 8388608        # 接收缓冲区默认值
net.core.wmem_default = 8388608        # 发送缓冲区默认值
net.ipv4.tcp_max_tw_buckets = 5000     # TIME-WAIT 最大数量
net.ipv4.tcp_fin_timeout = 30          # FIN-WAIT-2 超时（默认60）
net.core.netdev_max_backlog = 8192     # 网卡接收队列（默认1000）
net.core.optmem_max = 81920            # 辅助缓冲区（默认20480）
net.ipv4.tcp_rmem = 8760 262144 4194304
net.ipv4.tcp_wmem = 8760 262144 4194304
net.ipv4.tcp_mem = 88491 262144 4194304
```

### 14.5 JVM 调优

- **堆内内存** = 新生代 + 老年代 + 元空间，由 GC 统一管理。
- **堆外内存** = Direct Byte Buffers + Metaspace 等，直接受 OS 管理，减少 GC 暂停。

```bash
# -Xms 和 -Xmx 设置为相同值的好处：
# 避免堆内存动态伸缩导致的应用停顿，减少 GC 频率

# 参考文档
# JVM内存配置最佳实践: https://help.aliyun.com/document_detail/383255.html
```

---

## 十五、安全加固与应急响应

### 15.1 最小化安装后安全加固

1. 修改 YUM 源（换国内源）
2. 防火墙只开放对外服务端口
3. 精简开机自启动服务
4. 禁止 root 远程登录
5. 修改 SSH 端口
6. 添加普通用户并 sudo 提权
7. 安装杀毒软件 ClamAV
8. 配置 NTP 时间同步
9. 定时清理垃圾文件防止 inode 占满
10. 内核参数优化

### 15.2 防攻击

**攻击现象**：CPU/内存飙高、登录卡顿、带宽占满、大量异常 IP 登录、莫名账号和进程。

```bash
# 响应措施
last                                       # 查看登录历史
history / vim ~/.bash_history              # 查历史命令
ps aux --sort -%cpu | head                 # 找出高 CPU 进程
lsof -p PID                                # 定位病毒目录
rm -rf 病毒路径 && kill -9 PID             # 清除

# 加固措施
# 修改 SSH 端口 + 禁止 root 远程登录
# 清理计划任务 + 检查 /etc/rc.local
# 防火墙 drop 攻击 IP
```

### 15.3 防 CC/DOS/DDOS

1. 防火墙过滤高访问频率 IP
2. 拒绝代理服务器 IP
3. CC 攻击危害：大量流量冲击 → 负载升高 → 服务器宕机

### 15.4 病毒处理

```bash
# 顽固病毒
netstat -tnlp                              # 查端口
lsof -i:端口                               # 查进程和文件
chattr +i 目录                             # 锁定目录禁止修改
```

### 15.5 忘记 root 密码

```
重启 → 内核界面按 e → 在 UTF8 后加 init=/bin/bash → Ctrl+X
mount -o remount,rw /
passwd root
exec /sbin/init
```

## 十六、Shell 脚本与实用工具

### 16.1 日志管理

| 日志文件 | 内容 |
|----------|------|
| `/var/log/messages` | 系统主日志 |
| `/var/log/secure` | 登录认证日志 |
| `/var/log/dmesg` | 系统启动日志 |
| `/var/log/cron` | 计划任务日志 |
| `/var/log/yum.log` | YUM 安装日志 |
| `/etc/logrotate.d/syslog` | 日志轮转配置 |

```bash
tail -f /var/log/messages                  # 动态跟踪
grep Accepted /var/log/secure              # 登录成功
grep Failed /var/log/secure                # 登录失败
dmesg -d -T | grep -i Memory               # 内存相关信息

# 日志关键词: error, bad, must, failed, warn, already
```

### 16.2 日志分析案例

```bash
# HTTPD 起不来 -> 用户不存在
# Sep 8 10:30:06 httpd: AH00543: httpd: bad user name apache

# Nginx 起不来 -> 端口被占用
# nginx: [emerg] bind() to 0.0.0.0:80 failed (98: Address already in use)

# SSH 配置写错
# sshd: /etc/ssh/sshd_config: line 1: Bad configuration option: a
```

### 16.3 Nginx 日志分析

```bash
# 某天访问最多的10个IP
grep -E '19/Jul/2023' access.log | awk '{ips[$1]++}END{for(i in ips){print i,ips[i]}}' | sort -k2 -rn | head -10

# 某天访问大于100次的IP
grep '06/Jul/2023' access_06.log | awk '{ips[$1]++}END{for(i in ips){if(ips[i]>100){print i,ips[i]}}}' | sort -k2 -nr | head -30

# 某天访问最多的10个页面
grep '18/Aug/' access.log | awk '{ips[$7]++}END{for(i in ips){print i,ips[i]}}' | sort -k2 -nr | head -15

# 每个URL访问内容总大小
awk '{urls[$7]++;size[$7]+=$10}END{for(i in urls){print urls[i],size[i],i}}' | sort -k1 -rn | head -10
```

### 16.4 GoAccess 日志分析

```bash
wget https://tar.goaccess.io/goaccess-1.7.2.tar.gz
tar xf goaccess-1.7.2.tar.gz -C ./goaccess
cd goaccess/goaccess-1.7.2 && mkdir /usr/local/goaccess
yum -y install gcc autoconf gettext autopoint libmaxminddb-devel
./configure --prefix=/usr/local/goaccess --enable-utf8 --enable-geoip=mmdb
make && make install
ln -s /usr/local/goaccess/bin/goaccess /bin/

# 配置
cat <<-EOF >> /etc/goaccess.conf
time-format %T
date-format %d/%b/%Y
log_format %h - %^ [%d:%t %^] "%r" %s %b "%R" "%u" "%^" "%T"
EOF

# 生成报告
LANG="zh_CN.UTF-8" goaccess -f access.log -p /etc/goaccess.conf -o report.html
```

### 16.5 内核升级

```bash
uname -r                                       # 查看当前内核
rpm -Uvh http://www.elrepo.org/elrepo-release-7.0-3.el7.elrepo.noarch.rpm
yum --enablerepo=elrepo-kernel install -y kernel-lt
cat /boot/grub2/grub.cfg | grep menuentry       # 查看可用内核
grub2-set-default "CentOS Linux (4.4.221-1.el7.elrepo.x86_64) 7 (Core)"
grub2-editenv list                               # 确认默认启动项
reboot
```

### 16.6 定时任务发邮件

```bash
# /etc/mail.rc 配置 SMTP
# 发送邮件
mail -s '主题' -a 附件 收件人 < 正文文件

# 示例脚本
#!/bin/bash
showdate=$(date +%Y-%m-%d-%H-%M)
workdir=/mnt/dbpython
echo "$(date)" > ./test.txt
/bin/python3 /mnt/dbpython/daily_paper.py
cd ${workdir}
kyfile=$(find . -type f -name '*_ky_daily_paper.xlsx')
tar -czvf ${showdate}.tar.gz ${kyfile}
mail -s 'ky_daily_paper' -a ./${showdate}.tar.gz 收件人 < test.txt
find . -type f -name '*_ky_daily_paper.xlsx' -delete

# crontab: 55 23 * * * /bin/bash /mnt/dbpython/dbpython.sh
```


> **备注**：本文档为个人学习笔记整理，部分命令和配置可能因系统版本不同而有差异，请以实际环境为准。
