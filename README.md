# RegistrosDeVacina
Back-End dos registros de vacina, envolvendo Javascript, Node,Heroku e ElephantSQL.

# Requisitos

- O usuário efetua o seu próprio cadastro;
- O usuário efetua login;
- O usuário altera mail e senha;
- O e-mail é único;
- O usuário admin possui a função de cadastrar, editar, excluir e listar as vacinas;
- Somente o usuário admin pode mudar o perfil de acesso de outros usuários;
- O usuário comum não pode cadastrar vacinas;
- O usuário registra que foi vacinado fornecendo a identificação da vacina e a data no formato YYYY-MMDD;
- O usuário pode editar e excluir os seus registros de vacinação;
- O usuário pode listar os registros de vacina em ordem decrescente de data;
- O usuário possui acesso a somente os seus próprios registros de vacinação;
- Todas as operações requerem login;
- Os dados precisam ser persistidos no SGBD PostreSQL da cloud ElephantSQL;
- Fazer deploy da aplicação na cloud do Heroku.
