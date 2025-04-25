import * as React from 'react';
import USERS from '../../../../../common/data/userDummyData';
import Button from '../../../../../components/bootstrap/Button';
import { CardBody, CardFooter } from '../../../../../components/bootstrap/Card';
import InputGroup from '../../../../../components/bootstrap/forms/InputGroup';
import Textarea from '../../../../../components/bootstrap/forms/Textarea';
import Chat, { ChatGroup } from '../../../../../components/Chat';
import Checks from '../../../../../components/bootstrap/forms/Checks';
import { AvatarPicture } from '../../../../../constants/avatar';
import RecruitChat from '../../../../../api/assistant/recruit/chat';

export default function ChatJob({
	userData,
	sendFunction,
	formik,
	setThread,
	thread,
}: {
	userData: any;
	sendFunction: any;
	formik: any;
	thread: any;
	setThread: any;
}) {
	const [newMessage, setNewMessage] = React.useState<string>('');
	const [loadResponse, setLoadResponse] = React.useState<any>(false);
	const [messages, setMessages] = React.useState([
		{
			id: 1,
			messages: [
				{
					id: 1,
					message: 'Envie sua mensagem e suas dúvidas e eu te ajudarei. 🥰',
				},
			],
			user: userData,
			isReply: false,
		},
	]);
	const user = {
		//@ts-ignore
		// src: AvatarPicture[userData.avatar]
	};

	const sendMessages = () => {
		return new Promise(async (resolve, reject) => {
			try {
				if (!newMessage.trim()) return resolve(null); // Resolve se a mensagem estiver vazia

				setLoadResponse(true);

				const RecruitProps = {
					thread: thread,
					message: newMessage,
				};

				const newId = messages.length + 1;
				const userMessage = {
					id: newId,
					messages: [
						{
							id: 1,
							message: newMessage,
						},
					],
					user: user,
					isReply: true,
				};

				setMessages((prev: any) => [...prev, userMessage]);
				setNewMessage('');

				const response = await RecruitChat(RecruitProps);

				if (response && response?.status === 200) {
					console.log(response)
					console.log('th',response.thread)
					setThread(response.thread);
					const IAMessage = {
						id: newId + 1,
						messages: [
							{
								id: 1,
								message: response.response,
							},
						],
						user: user,
						isReply: false,
					};

					setMessages((prev: any) => [...prev, IAMessage]);
					setLoadResponse(false);
					resolve(IAMessage); // Resolve a promise com a mensagem da IA
				} else {
					setLoadResponse(false);
					reject('Erro na resposta do servidor');
				}
			} catch (err: any) {
				setLoadResponse(false);
				reject(`Erro no envio da mensagem: ${err.message}`);
			}
		});
	};

	React.useEffect(() => {
		if (sendFunction) {
			const RecruitProps = {
				thread: null,
				message: `Você vai me ajudar com a vaga ${formik.values.function}`,
			};
			RecruitChat(RecruitProps);
		}
	}, [sendFunction]);

	return (
		<>
			<CardBody isScrollable>
				<Chat>
					{messages.map((msg) => (
						<ChatGroup
							key={String(msg.messages)}
							messages={msg.messages}
							user={msg.user}
							isReply={msg.isReply}
						/>
					))}
				</Chat>
			</CardBody>
			<CardFooter className='d-block w-100'>
				{loadResponse && (
					<div className='spinner-grow spinner-grow-sm mb-2' role='status'>
						<span className='visually-hidden'>Loading...</span>
					</div>
				)}
				<InputGroup className='w-100'>
					<Textarea
						name='message'
						ariaLabel='Message'
						value={newMessage}
						onChange={(e: any) => setNewMessage(e.target.value)}
						placeholder='Digite sua mensagem...'
					/>
					<Button color='info' icon='Send' onClick={sendMessages}>
						Enviar
					</Button>
				</InputGroup>
			</CardFooter>
		</>
	);
}
