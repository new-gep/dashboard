// Importa a interface SingUpProps
interface SingUpProps {
	cnpj?: string;
	name?: string;
	email?: string;
	phone?: string;
	user?: string;
	password?: string;
	hasType?: boolean;
	municipal_registration?: string;
	state_registration?: string;
}

// Função de validação para o CNPJ (pode ser mais completa, dependendo das regras de validação)
function isValidCnpj(cnpj: string) {
	const regex = /^\d{14}$/; // Aceita apenas 14 dígitos numéricos
	return regex.test(cnpj);
}

// Função de validação para o número de telefone
function isValidPhone(phone: string) {
	const regex = /^\d{10,11}$/; // Aceita números com 10 ou 11 dígitos (com ou sem DDD)
	return regex.test(phone);
}

// Função de validação para a senha (exemplo de regras: mínimo de 6 caracteres)
function isValidPassword(password: string) {
	return password.length >= 6;
}

// Função de validação para o usuário (sem espaços)
function isValidUser(user: string) {
	return !/\s/.test(user); // Verifica se há espaços no nome de usuário
}

function isValidStateRegistration(stateRegistration: string) {
	const { length } = stateRegistration;
	return length >= 8 && length <= 14; // Inscrição Estadual entre 8 e 14 dígitos
}

function isValidEmail(email: string): boolean {
	// Regex para verificar um e-mail válido
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

	// Testa se o e-mail passado é válido
	return emailRegex.test(email);
}

// Função de validação principal
export default function AuthSingUp(dates: SingUpProps) {
	const errors: { [key: string]: string } = {};

	// Validação do CNPJ
	if (!dates.cnpj || !isValidCnpj(dates.cnpj)) {
		errors.cnpj = 'CNPJ inválido.';
	}

	// Validação do nome (não tem a regra de não conter espaços)
	if (!dates.name || dates.name.trim() === '') {
		errors.name = 'Nome obrigatório.';
	}

	// Validação do
	if (!dates.phone || !isValidPhone(dates.phone)) {
		errors.phone = 'Celular inválido.';
	}

	// Validação do usuário (sem espaços)
	if (!dates.user || !isValidUser(dates.user)) {
		errors.user = 'O nome de usuário não pode conter espaços.';
	}

	// Validação da senha
	if (!dates.password || !isValidPassword(dates.password)) {
		errors.password = 'A senha deve ter pelo menos 6 caracteres.';
	}

	if (!dates.hasType) {
		errors.hasType = 'Selecione um tipo de conta.';
	}

	if (!dates.municipal_registration || dates.municipal_registration.trim() === '') {
		errors.municipal_registration = 'Inscrição Municipal obrigatória.';
	}

	// Validação da Inscrição Estadual
	if (!dates.state_registration || dates.state_registration.trim() === '') {
		errors.state_registration = 'Inscrição Estadual obrigatória.';
	} else if (!isValidStateRegistration(dates.state_registration)) {
		errors.state_registration = 'Inscrição Estadual inválida. Deve ter entre 8 e 14 dígitos.';
	}

	if (!dates.email || dates.email.trim() === '') {
		errors.email = 'Email obrigatório.';
	} else if (!isValidEmail(dates.email)) {
		errors.email = 'Email inválido.';
	}

	// Verifica se há erros
	if (Object.keys(errors).length > 0) {
		return { isValid: false, errors };
	}

	// Se tudo estiver válido
	return { isValid: true, errors: {} };
}
