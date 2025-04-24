import * as React from 'react';
import USERS from '../../../../../common/data/userDummyData';
import Button from '../../../../../components/bootstrap/Button';
import { CardBody, CardFooter } from '../../../../../components/bootstrap/Card';
import InputGroup from '../../../../../components/bootstrap/forms/InputGroup';
import Textarea from '../../../../../components/bootstrap/forms/Textarea';
import Chat, { ChatGroup } from '../../../../../components/Chat';
import Checks from '../../../../../components/bootstrap/forms/Checks';
import { AvatarPicture } from '../../../../../constants/avatar';

export default function ChatJob({ userData }: { userData: any }) {
	const [newMessage, setNewMessage] = React.useState('');
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
    }

	const sendMessages = () => {
		if (!newMessage.trim()) return;

		const newId = messages.length + 1;
		const userMessage = {
			id: newId,
			messages: [
				{
					id: 1,
					message: newMessage,
				},
			],
			user: user, // você pode trocar isso pelo usuário atual
			isReply: true,
		};

		setMessages((prev:any) => [...prev, userMessage]);
		setNewMessage('');
	};

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
				<InputGroup className='w-100'>
					<Textarea
						name='message'
						ariaLabel='Message'
						value={newMessage}
						onChange={(e: any) => setNewMessage(e.target.value)}
						placeholder='Digite sua mensagem...'
					/>
					<Button color='info' icon='Send' onClick={sendMessages}>
						SEND
					</Button>
				</InputGroup>
			</CardFooter>
		</>
	);
}
