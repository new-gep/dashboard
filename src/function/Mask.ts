type MaskType = 
    | 'phone' 
    | 'amount' 
    | 'cpf' 
    | 'firstName' 
    | 'secondName' 
    | 'day' 
    | 'month' 
    | 'year' 
    | 'remove' 
    | 'amountHidden' 
    | 'km' 
    | 'dateFormat' 
    | 'hiddenPhone' 
    | 'hiddenEmail'
    | 'emailBreakLine'
    | 'fullName'
    | 'dateFormatBrazil';

export default function Mask(type: MaskType, value: string | number): string {
    switch (type) {
        case 'phone': {
            const cleanedValue = value.toString().replace(/\D/g, '');
            let maskedValue = '';
            if (cleanedValue.length < 11) {
                maskedValue = cleanedValue.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
            } else {
                maskedValue = cleanedValue.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
            }
            return maskedValue;
        }
        case 'amount': {
            const formattedAmount = (Number(value) / 100).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            });
            return formattedAmount;
        }
        case 'cpf': {
            return value.toString().replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
        }
        case 'firstName': {
            return value.toString().split(' ')[0];
        }
        case 'secondName': {
            return value.toString().split(' ').slice(1).join(' ');
        }
        case 'fullName': {
            const names = value.toString().trim().split(' ');
            const firstName = names[0];
            const lastName = names.length > 1 ? names[names.length - 1] : '';
            return  `${firstName} ${lastName}`;
        }
        case 'day': {
            return new Date(value.toString()).getDate().toString();
        }
        case 'month': {
            return (new Date(value.toString()).getMonth() + 1).toString();
        }
        case 'year': {
            return new Date(value.toString()).getFullYear().toString();
        }
        case 'remove': {
            return value.toString().replace(/\D/g, '');
        }
        case 'amountHidden': {
            const amount = (Number(value) / 100).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            });
            return amount.replace(/\d/g, '*');
        }
        case 'km': {
            const km = parseFloat(value.toString());
            return km.toFixed(2);
        }
        case 'dateFormat': {
            if (!value) {
                return '';
            }
            const meses = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
            const partes = value.toString().split('T');
            const data = partes[0].split('-');
            const hora = partes[1].split(':');

            const ano = data[0];
            const mesIndex = parseInt(data[1]) - 1;
            const mes = meses[mesIndex];
            const dia = data[2].padStart(2, '0');
            const horas = hora[0].padStart(2, '0');
            const minutos = hora[1].padStart(2, '0');
            const segundos = hora[2];
            const fusoHorario = 'UTC';

            const dataFormatada = `dia ${dia} de ${mes} de ${ano} às ${horas}:${minutos}`;
            return dataFormatada;
        }
        case 'dateFormatBrazil': {
            if (!value) {
                return '';
            }
            const meses = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
            const partes = value.toString().split('T');
            const data = partes[0].split('-');
            const hora = partes[1].split(':');

            const ano = data[0];
            const mesIndex = parseInt(data[1]) - 1;
            const mes = meses[mesIndex];
            const dia = data[2].padStart(2, '0');
            const horas = hora[0].padStart(2, '0');
            const minutos = hora[1].padStart(2, '0');
            const segundos = hora[2];
            const fusoHorario = 'UTC';

            const dataFormatada = `${dia} de ${mes} de ${ano}`;
            return dataFormatada;
        }
        case 'hiddenPhone': {
            const telefoneLimpo = value.toString().replace(/\D/g, '');
            return `(${telefoneLimpo.slice(0, 2)}) ${telefoneLimpo.slice(2, 7)}-****`;
        }
        case 'hiddenEmail': {
            const [usuario, dominio] = value.toString().split('@');
            const usuarioMascarado = usuario.length > 4 
                ? `${usuario.slice(0, 4)}${'*'.repeat(usuario.length - 4)}`
                : usuario;
            return `${usuarioMascarado}@${dominio}`;
        }
        case 'emailBreakLine' : {
            value = value.toString()
            const [user, domain] = value.split('@');
    
            // Retorne o e-mail formatado com uma quebra de linha entre o usuário e o domínio
            return `${user}\n@${domain}`;
        }
        default: {
            return value.toString();
        }
    }
}
