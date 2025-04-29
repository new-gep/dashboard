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
	| 'dateFormatBrazil'
	| 'lastUpdate'
	| 'date'
	| 'birth';

export default function Mask(type: MaskType, value: any): string {
	if (!value) {
		return value;
	}
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
			if (value == '') {
				return '';
			}

			const formattedAmount = (Number(value) / 100).toLocaleString('pt-BR', {
				style: 'currency',
				currency: 'BRL',
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
			return `${firstName} ${lastName}`;
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
				currency: 'BRL',
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
			const meses = [
				'janeiro',
				'fevereiro',
				'março',
				'abril',
				'maio',
				'junho',
				'julho',
				'agosto',
				'setembro',
				'outubro',
				'novembro',
				'dezembro',
			];
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
		case 'lastUpdate': {
			const date = new Date(value); // Converte a string para um objeto Date

			// Extrai a hora e o mês em UTC
			const hours = date.getUTCHours().toString().padStart(2, '0'); // Hora formatada em UTC
			const minutes = date.getUTCMinutes().toString().padStart(2, '0'); // Minutos formatados em UTC
			const day = date.getUTCDate().toString().padStart(2, '0'); // Dia formatado com dois dígitos
			// Array de meses em português
			const months = [
				'janeiro',
				'fevereiro',
				'março',
				'abril',
				'maio',
				'junho',
				'julho',
				'agosto',
				'setembro',
				'outubro',
				'novembro',
				'dezembro',
			];

			const month = months[date.getMonth()]; // Obtém o nome do mês

			// Retorna a string formatada
			return `${hours}:${minutes} de ${day} de ${month}`;
		}
		case 'dateFormatBrazil': {
			if (!value) {
				return '';
			}
			const meses = [
				'janeiro',
				'fevereiro',
				'março',
				'abril',
				'maio',
				'junho',
				'julho',
				'agosto',
				'setembro',
				'outubro',
				'novembro',
				'dezembro',
			];
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
			const usuarioMascarado =
				usuario.length > 4
					? `${usuario.slice(0, 4)}${'*'.repeat(usuario.length - 4)}`
					: usuario;
			return `${usuarioMascarado}@${dominio}`;
		}
		case 'emailBreakLine': {
			value = value.toString();
			const [user, domain] = value.split('@');

			// Retorne o e-mail formatado com uma quebra de linha entre o usuário e o domínio
			return `${user}\n@${domain}`;
		}
		case 'date': {
			// Cria um objeto Date a partir do valor ISO
			const dateObj = new Date(value);

			// Extrai o dia, mês e ano
			const dia = String(dateObj.getDate()).padStart(2, '0'); // Garante que o dia tenha 2 dígitos
			const mes = String(dateObj.getMonth() + 1).padStart(2, '0'); // Garante que o mês tenha 2 dígitos
			const ano = dateObj.getFullYear(); // Extrai o ano

			// Retorna a data no formato brasileiro (DD/MM/YYYY)
			return `${dia}/${mes}/${ano}`;
		}
		case 'birth': {
			// Converte o valor (ISO format) diretamente em um objeto Date
			const birthDate = new Date(value);

			if (isNaN(birthDate.getTime())) {
				console.error('Data de nascimento inválida');
				return 'Data inválida';
			}

			const hoje = new Date();
			let idade = hoje.getFullYear() - birthDate.getFullYear();
			const mesAtual = hoje.getMonth();
			const diaAtual = hoje.getDate();

			// Ajusta a idade se a data de nascimento ainda não foi alcançada no ano atual
			if (
				mesAtual < birthDate.getMonth() ||
				(mesAtual === birthDate.getMonth() && diaAtual < birthDate.getDate())
			) {
				idade--;
			}

			return `${idade} anos`;
		}
		case 'amount':{
			if (!value) return '';
			// Remove tudo que não for número
			let cleaned = value.replace(/\D/g, '');

			// Se for vazio, retorna R$ 0,00
			if (cleaned.length === 0) return 'R$ 0,00';

			// Converte para número e força no formato de centavos
			const numberValue = parseInt(cleaned, 10);

			// Divide por 100 para colocar centavos
			const floatValue = numberValue / 100;

			// Formata com padrão brasileiro (pt-BR)
			return floatValue.toLocaleString('pt-BR', {
				style: 'currency',
				currency: 'BRL',
			});
		}
		default: {
			return value.toString();
		}
	}
}
