# 📱 Check Presence App

Aplicativo mobile desenvolvido com **React Native + Expo**, integrado a uma API em **Laravel**, para gerenciamento de **frequência estudantil** via código ou leitura de **QR Codes**.

---

## ⚙️ Funcionalidades

- Login por matrícula e senha
- Listagem das matérias em que o aluno está matriculado
- Visualização das aulas com:
  - Data, horário e local
  - Status da presença (Presente, Ausente ou Não registrado)
  - Horário do registro (se houver)
- Leitura de QR Code (em desenvolvimento ou disponível conforme versão)
- Integração com API REST em Laravel protegida por Laravel Sanctum

---

## 🧱 Tecnologias

### Front-end (mobile)

- React Native
- Expo
- Axios
- AsyncStorage
- React Navigation

### Back-end (API)

- Laravel 10+
- Laravel Sanctum (para autenticação)
- MySQL
- Eloquent ORM

---

## 🚀 Como executar o projeto

Para executar o projeto você deve seguir os seguintes passos:

- Copie o arquivo `api.ts.example`, renomeie sua cópia para `api.ts` e altere o baseURL com o IP da sua máquina.
- execute o comando: ```npm install```
- execute o comando: ```npx expo start```

