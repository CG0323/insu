#coding=utf-8
from __future__ import with_statement
from fabric.api import local, env, settings, abort, run, cd
from fabric.contrib.console import confirm
import time

# env.use_ssh_config = True
env.hosts = ['121.190.40.48']
env.user = 'www'
env.key_filename = '/Users/wangchun/Downloads/development/id_hongye'

# code_dir='/var/www/deploy-stage'
# app_dir='/var/www/application'
repo='https://github.com/CG0323/insu.git'
timestamp="release_%s" % int(time.time() * 1000)

def deploy():
    push()
    server_pull()

def push():
    local("git add --a")
    local("git commit")
    # local("git commit -m 'auto commit with fabric'")
    local("git push")

def server_pull():
    with cd('~/wwwroot/insu'):   #cd用于进入某个目录
        # run('git add --a') 
        # run('git stash') 
        run('git pull origin V3.2')  #远程操作用run
        run('pm2 kill')
        run('NODE_ENV=production pm2 start bin/www')
