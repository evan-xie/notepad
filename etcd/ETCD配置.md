# ETCD配置

## 配置文件

配置文件类型：*.yml

### 配置文件说明

~~~yaml
#实例名称
name: etcd-2
#数据保存目录
data-dir: C:\Users\37852\Desktop\etcd\data
#供外部客户端使用的url
listen-client-urls: http://192.168.1.113:2379,http://127.0.0.1:2379
#广播给外部客户端使用的url
advertise-client-urls: http://192.168.1.113:2379,http://127.0.0.1:2379
#集群内部通信使用的URL
listen-peer-urls: http://192.168.1.113:2380
#广播给集群内其他成员访问的URL
initial-advertise-peer-urls: http://192.168.1.113:2380
#初始集群成员列表
initial-cluster: etcd-1=http://192.168.1.142:2380,etcd-2=http://192.168.1.113:2380
#集群的名称
initial-cluster-token: etcd-cluster-token
#初始集群状态，new为新建集群
initial-cluster-state: new
~~~

## 常用命令

### etcdctl命令

| 命令                   | 说明                                                     |
| ---------------------- | -------------------------------------------------------- |
| etcdctl member list    | 查看集群成员                                             |
|                        |                                                          |
| etcdctl cluster-health | 每个节点上执行查看健康状态                               |
| watch                  | 监听某个 key，当 key 改变的时候会打印出变化              |
| watch --recursive      | 监听某个目录，当目录中任何 node 改变的时候，都会打印出来 |
|                        |                                                          |
|                        |                                                          |
|                        |                                                          |
|                        |                                                          |
|                        |                                                          |
|                        |                                                          |
|                        |                                                          |
|                        |                                                          |
|                        |                                                          |
|                        |                                                          |
|                        |                                                          |
|                        |                                                          |
|                        |                                                          |
|                        |                                                          |

~~~
# 设置一个 key 的值
➜ ./etcdctl set /message "hello, etcd"
hello, etcd

# 获取 key 的值
➜ ./etcdctl get /message
hello, etcd

# 获取 key 的值，包含更详细的元数据
➜  ./etcdctl -o extended get /message
Key: /message
Created-Index: 1073
Modified-Index: 1073
TTL: 0
Index: 1073

hello, etcd

# 获取不存在 key 的值，会报错
➜  ./etcdctl get /notexist
Error:  100: Key not found (/notexist) [1048]

# 设置 key 的 ttl，过期后会被自动删除
➜  ./etcdctl set /tempkey "gone with wind" --ttl 5
gone with wind
➜  ./etcdctl get /tempkey
gone with wind
➜  ./etcdctl get /tempkey
Error:  100: Key not found (/tempkey) [1050]

# 如果 key 的值是 "hello, etcd"，就把它替换为 "goodbye, etcd"
➜  ./etcdctl set --swap-with-value "hello, world" /message "goodbye, etcd"
Error:  101: Compare failed ([hello, world != hello, etcd]) [1050]
➜  ./etcdctl set --swap-with-value "hello, etcd" /message "goodbye, etcd"
goodbye, etcd

# 仅当 key 不存在的时候创建
➜  ./etcdctl mk /foo bar
bar
➜  ./etcdctl mk /foo bar
Error:  105: Key already exists (/foo) [1052]

# 自动创建排序的 key
➜  ./etcdctl mk --in-order /queue job1
job1
➜  ./etcdctl mk --in-order /queue job2
job2
➜  ./etcdctl ls --sort /queue
/queue/00000000000000001053
/queue/00000000000000001054

# 更新 key 的值或者 ttl，只有当 key 已经存在的时候才会生效，否则报错
➜  ./etcdctl update /message "I'am changed"
I'am changed
➜  ./etcdctl get /message
I'am changed
➜  ./etcdctl update /notexist "I'am changed"
Error:  100: Key not found (/notexist) [1055]
➜  ./etcdctl update --ttl 3 /message "I'am changed"
I'am changed
➜  ./etcdctl get /message
Error:  100: Key not found (/message) [1057]

# 删除某个 key
➜  ./etcdctl mk /foo bar
bar
➜  ./etcdctl rm /foo
PrevNode.Value: bar
➜  ./etcdctl get /foo
Error:  100: Key not found (/foo) [1062]

# 只有当 key 的值匹配的时候，才进行删除
➜  ./etcdctl mk /foo bar
bar
➜  ./etcdctl rm --with-value wrong /foo
Error:  101: Compare failed ([wrong != bar]) [1063]
➜  ./etcdctl rm --with-value bar /foo

# 创建一个目录
➜  ./etcdctl mkdir /dir

# 删除空目录
➜  ./etcdctl mkdir /dir/subdir/
➜  ./etcdctl rmdir /dir/subdir/

# 删除非空目录
➜  ./etcdctl rmdir /dir
Error:  108: Directory not empty (/dir) [1071]
➜  ./etcdctl rm --recursive /dir

# 列出目录的内容
➜  ./etcdctl ls /
/queue
/anotherdir
/message

# 递归列出目录的内容
➜  ./etcdctl ls --recursive /
/anotherdir
/message
/queue
/queue/00000000000000001053
/queue/00000000000000001054

# 监听某个 key，当 key 改变的时候会打印出变化
➜  ./etcdctl watch /message
changed

# 监听某个目录，当目录中任何 node 改变的时候，都会打印出来
➜  ./etcdctl watch --recursive /
[set] /message
changed

# 一直监听，除非 `CTL + C` 导致退出监听
➜  ./etcdctl watch --forever /message
new value
chaned again
Wola

# 监听目录，并在发生变化的时候执行一个命令
➜  ./etcdctl exec-watch --recursive / -- sh -c "echo change detected."
change detected.
change detected.
~~~



### etcd命令

| 命令                          | 说明                                                         |
| ----------------------------- | ------------------------------------------------------------ |
| etcd --config-file            | 配置文件启动                                                 |
| --name                        | etcd集群中的节点名                                           |
| --listen-peer-urls            | 监听的用于节点之间通信的url，可监听多个，集群内部将通过这些url进行数据交互 |
| --initial-advertise-peer-urls | 建议用于节点之间通信的url，节点间将以该值进行通信。          |
| --listen-client-urls          | 监听的用于客户端通信的url,同样可以监听多个。                 |
| --advertise-client-urls       | 建议使用的客户端通信url,该值用于etcd代理或etcd成员与etcd节点通信 |
| --initial-cluster-token       | 节点的token值，设置该值后集群将生成唯一id,并为每个节点也生成唯一id,当使用相同配置文件再启动一个集群时，只要该token值不一样，etcd集群就不会相互影响。 |
| --initial-cluster             | 也就是集群中所有的initial-advertise-peer-urls 的合集         |
| --initial-cluster-state new   | 新建集群的标志                                               |
|                               |                                                              |
|                               |                                                              |
|                               |                                                              |
|                               |                                                              |
|                               |                                                              |
|                               |                                                              |
|                               |                                                              |
|                               |                                                              |
|                               |                                                              |
|                               |                                                              |

