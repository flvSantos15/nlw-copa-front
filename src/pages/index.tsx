import Image from "next/image";

import { api } from "../services/api";

import appPreviewImg from "../assets/app-nlw-copa-preview.png";
import logoImg from "../assets/logo.svg";
import avatarImg from "../assets/user-avatares.png";
import iconCheckImg from "../assets/icon-check.svg";
import { FormEvent, useState } from "react";

interface IHome {
	poolCount: number;
	guessCount: number;
	userCount: number;
}

export default function Home({ poolCount, guessCount, userCount }: IHome) {
	const [poolTitle, setPoolTitle] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const createPool = async (e: FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		try {
			if (!poolTitle) return;

			if (poolTitle) {
				const response = await api.post("/pools", {
					title: poolTitle,
				});

				const { code } = response.data;

				navigator.clipboard.writeText(code);

				alert(
					"Bolão criado com sucesso, o código foi copiado para a área de transferência."
				);
			}
		} catch (err) {
			return err;
		} finally {
			setPoolTitle("");
			setIsLoading(false);
		}
	};

	return (
		<div className="max-w-[1124px] h-screen mx-auto grid grid-cols-2 gap-28 items-center">
			<main>
				<Image src={logoImg} alt="NLW copa" />

				<h1 className="mt-14 text-white text-5xl font-bold leading-tight">
					Crie seu próprio bolão da copa e compartilhe entre amigos!
				</h1>
				<div className="mt-10 flex items-center gap-2">
					<Image src={avatarImg} alt="" />

					<strong className="text-gray-100 text-xl">
						<span className="text-ignite-500">+{userCount}</span>{" "}
						{userCount > 1 ? "pessoas já estão" : "pessoa já está"} usando
					</strong>
				</div>

				<form onSubmit={createPool} className="mt-10 flex gap-2">
					<input
						className="flex-1 px-6 py-4 rounded bg-gray-800 border border-gray-600 text-sm text-gray-100"
						type="text"
						required
						placeholder="Qual nome do seu bolão?"
						value={poolTitle}
						onChange={(e) => setPoolTitle(e.target.value)}
					/>
					<button
						className="bg-yellow-500 px-6 py-4 rounded text-gray-900 font-bold text-sm uppercase hover:bg-yellow-700 hover:opacity-70"
						type="submit"
						disabled={!poolTitle}
					>
						Criar seu bolão
					</button>
				</form>

				<p className="mt-4 text-sm text-gray-300 leading-relaxed">
					Após criar seu bolão, você receberá um código único que poderá usar
					para convidar outras pessoas 🚀
				</p>

				<div className="mt-10 pt-10 border-t border-gray-600 flex items-center justify-between text-gray-100">
					<div className="flex items-center gap-6">
						<Image src={iconCheckImg} alt="" />
						<div className="flex flex-col">
							<span className="font-bold text-2xl">+{poolCount}</span>
							<span>{poolCount > 1 ? "Bolões criados" : "Bolão criado"}</span>
						</div>
					</div>

					<div className="w-px h-14 bg-gray-600" />

					<div className="flex items-center gap-6">
						<Image src={iconCheckImg} alt="" />
						<div className="flex flex-col">
							<span className="font-bold text-2xl">+{guessCount}</span>
							<span>
								{guessCount > 1 ? "Palpites enviados" : "Palpite enviado"}
							</span>
						</div>
					</div>
				</div>
			</main>

			<Image
				src={appPreviewImg}
				alt="Dois celulares exibindo uma prévia da aplicação móvel do NLW Copa"
				quality={100}
			/>
		</div>
	);
}

export async function getStaticProps() {
	const [poolCountResponse, guessCountResponse, usersCountResponse] =
		await Promise.all([
			api.get("/pools/count"),
			api.get("/guesses/count"),
			api.get("/users/count"),
		]);

	return {
		props: {
			poolCount: poolCountResponse.data.count,
			guessCount: guessCountResponse.data.guess,
			userCount: usersCountResponse.data.user,
		},
	};
}
