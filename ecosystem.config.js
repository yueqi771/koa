/* eslint-disable camelcase */
module.exports = {
    apps: [{
        name: 'rcms-node',
        script: 'app.js',
        args: 'one two', 
        instances: 2,
        autorestart: true,
        env: {
            NODE_ENV: 'development'
        },
        env_production: {
            NODE_ENV: 'production'
        }
    }],
    "deploy": {
		"production": {
			"user": "wangdongxu@vipkid.com.cn",
			"host": ["10.23.4.51"],
			"port": "22",
			"ref": "origin/develop",
			"repo": "ssh://git@code.vipkid.com.cn:3590/lc/rcms-node.git",
			"path": "/home/wangdongxu/rcms-node",
			// "ssh_options": "",
            "key": "/home/wangdongxu/.ssh/id_rsa.pub",
            "post-deploy": "npm install",
			"pre-deploy-local": "echo 'Deploy Done'",
			"env": {
				"NODE_ENV": "production"
			}
		}
	}
};
