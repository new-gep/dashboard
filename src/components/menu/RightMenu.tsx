import React, { useState, useEffect, useRef, useCallback } from 'react';
import ReactDOM from 'react-dom';

interface MenuItem {
	icon?: string;
	label: string;
	onClick: () => void;
}

interface RightMenuProps {
	menuItems: MenuItem[];
	ref: React.RefObject<HTMLElement>;
}

export default function RightMenu({ menuItems }: RightMenuProps) {
	const [menuVisible, setMenuVisible] = useState(false);
	const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
	const menuRef = useRef<HTMLDivElement | null>(null);

	const handleContextMenu = useCallback(
		(event: MouseEvent) => {
			// Verifica se o clique foi dentro da área da ref
			if (menuRef.current && menuRef.current.contains(event.target as Node)) {
				event.preventDefault(); // Impede o menu de contexto padrão do navegador
				setMenuPosition({ x: event.clientX, y: event.clientY });
				setMenuVisible(true);
			}
		},
		[menuRef],
	);

	const handleClick = useCallback(
		(event: MouseEvent) => {
			if (menuVisible && menuRef.current && !menuRef.current.contains(event.target as Node)) {
				setMenuVisible(false); // Fecha o menu se o clique for fora
			}
		},
		[menuVisible],
	);

	useEffect(() => {
		document.addEventListener('contextmenu', handleContextMenu);
		document.addEventListener('click', handleClick);

		return () => {
			document.removeEventListener('contextmenu', handleContextMenu);
			document.removeEventListener('click', handleClick);
		};
	}, [handleContextMenu, handleClick]);

	if (!menuVisible) {
		return null; // Não renderiza nada se o menu não estiver visível
	}

	return ReactDOM.createPortal(
		<div
			ref={menuRef}
			style={{
				position: 'absolute',
				top: menuPosition.y,
				left: menuPosition.x,
				backgroundColor: 'white',
				border: '1px solid #ccc',
				borderRadius: '4px',
				zIndex: 1000,
				boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
			}}>
			<ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
				{menuItems.map((option, index) => (
					<li key={index}>
						<button
							style={{
								padding: '8px 12px',
								border: 'none',
								width: '100%',
								textAlign: 'left',
							}}
							onClick={() => {
								option.onClick(); // Executa a função onClick do item
								setMenuVisible(false); // Fecha o menu após clicar
							}}>
							{option.label}
						</button>
					</li>
				))}
			</ul>
		</div>,
		document.body, // Renderiza o menu diretamente no body
	);
}
