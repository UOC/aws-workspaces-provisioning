# Desplegament lambda

## Requisits

EL desplegament requereix comptes programàtiques d'amazon web services i de la eina [serveless](https://serverless.com/):

* Cal compar amb una instalacío de nodejs 
* cal fer la instalacío de serverless [segons aquest document](https://serverless.com/framework/docs/getting-started/)
* cal tenir configurat [un profile de aws](https://serverless.com/framework/docs/providers/aws/guide/credentials/) anomenat vdi amb [permissos](https://serverless.com/framework/docs/dashboard/
access-roles/) 
* cal crear un fitxer amb paràmetres a ``~/.config/sls/<nomservei>.<entorn>.json`` sino heu editat serverless.yml: ``~/.config/sls/vdisls.pro.json``

## Procediment:

```
git clone <nom del repositori>
cat >  ~/.config/sls/vdisls.pro.json << 'EOM'
{
"JWT_SECRET": "xxxxxx",
"bundle_id": "wsb-xxxxxx",
"directory_id": "d-xxxxxxx",
"ci": "e-treball",
"UOCEnv": "PRO",
"Departament": "TIC",
"RunningMode": "AUTO_STOP",
"ComputeTypeName": "STANDARD",
"affiliations": "staff",
"auth_mode": "user",
"account_id": "xxxxxxx"
}
EOM

cd vdi-provisioning/aws-lambda
npm install jsonwebtoken
serverless deploy
```


