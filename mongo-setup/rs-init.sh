#!/bin/bash

sleep 5
mongosh <<EOF

use admin 
db.createUser(
   {
     user: '${MONGO_INITDB_ROOT_USERNAME}',
     pwd: '${MONGO_INITDB_ROOT_PASSWORD}',
     roles: [ { role: "dbOwner", db: '${MONGO_INITDB_DATABASE}' } ]
   }
 )
db.auth('${MONGO_INITDB_ROOT_USERNAME}','${MONGO_INITDB_ROOT_PASSWORD}')
rs.initiate({ _id: 'rs0', members: [{ _id: 0, host: '${MONGO_HOST}:27017'  }, { _id: 1, host: '${MONGO_HOST_1}:27017' }, { _id: 2, host: '${MONGO_HOST_2}:27017' }] })

EOF
