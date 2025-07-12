import * as fs from "node:fs";
import {
	By,
	Key,
	until,
	type WebDriver,
	type WebElement,
} from "selenium-webdriver";

export async function click(
	driver: WebDriver,
	selector_type: "css" | "xpath",
	selector: string,
) {
	try {
		if (selector_type === "css") {
			await driver.wait(until.elementLocated(By.css(selector)), 6000).click();
			console.log(
				`O elemento:\n\r "${selector}" foi clicado via ${selector_type} com sucesso !\n\r`,
			);
		} else if (selector_type === "xpath") {
			await driver.wait(until.elementLocated(By.xpath(selector)), 6000).click();
			console.log(
				`O elemento:\n\r "${selector}" foi clicado via ${selector_type} com sucesso !\n\r`,
			);
		} else {
			throw new Error("O selector_type passado é inválido");
		}
	} catch (e) {
		throw new Error(`A function click falhou !!!${e}`);
	}
}

type writebleElem = WebElement | null;

export async function write(
	driver: WebDriver,
	selector_type: "css" | "xpath",
	selector: string,
	text: string,
) {
	let finded: writebleElem;
	try {
		if (selector_type === "css") {
			finded = await driver.wait(until.elementLocated(By.css(selector)), 6000);
		} else if (selector_type === "xpath") {
			finded = await driver.wait(
				until.elementLocated(By.xpath(selector)),
				6000,
			);
		} else {
			throw new Error("O selector_type passado é inválido");
		}
		await finded.sendKeys(text);
		console.log(
			`O texto:\n\r "${text}" foi escrito no elemento: "${selector}" via ${selector_type} com sucesso !\n\r\r`,
		);
	} catch (e) {
		throw new Error(`A function write falhou !!!${e}`);
	}
}

export function processarArquivo(caminhoArquivo: fs.PathOrFileDescriptor) {
	const perguntas: string[] = [];
	const respostas: string[] = [];
	const regex = /^(P|R):\s*(.*)/;

	try {
		const conteudo = fs.readFileSync(caminhoArquivo, "utf8");
		const linhas = conteudo.split("\n");

		let perguntaAtual = "";
		let respostaAtual = "";
		let tipoAtual: "P" | "R" | null = null;

		linhas.forEach((linha) => {
			const match = regex.exec(linha);
			if (match) {
				if (tipoAtual === "P" && perguntaAtual) {
					perguntas.push(perguntaAtual.trim());
					perguntaAtual = "";
				} else if (tipoAtual === "R" && respostaAtual) {
					respostas.push(respostaAtual.trim());
					respostaAtual = "";
				}

				tipoAtual = match[1] as "P" | "R";
				if (tipoAtual === "P") {
					perguntaAtual = match[2];
				} else {
					respostaAtual = match[2];
				}
			} else if (tipoAtual) {
				if (tipoAtual === "P") {
					perguntaAtual += ` ${linha.trim()}`;
				} else {
					respostaAtual += ` ${linha.trim()}`;
				}
			}
		});

		if (tipoAtual === "P" && perguntaAtual)
			perguntas.push(perguntaAtual.trim());
		if (tipoAtual === "R" && respostaAtual)
			respostas.push(respostaAtual.trim());

		console.log("Perguntas:", perguntas);
		console.log("Respostas:", respostas);
	} catch (error) {
		console.error("Erro ao ler o arquivo:", error);
	}

	return { perguntas, respostas };
}

type literial_element = string | null;

export async function selectDropdown(
	driver: WebDriver,
	css_selector: string,
	nome_do_deck: string,
	rude_element: literial_element,
) {
	try {
		if (rude_element == null) {
			const actions = driver.actions({ async: true });
			const clickable = await driver.wait(
				until.elementLocated(By.css(css_selector)),
			);
			await actions.move({ origin: clickable }).click().perform();
			await clickable.sendKeys(nome_do_deck);
			await clickable.sendKeys(Key.ENTER);
			console.log(
				`A opção "${nome_do_deck}" foi selecionada com sucesso.\n\r\r`,
			);
		} else {
			const actions = driver.actions({ async: true });
			const clickable: WebElement = await driver.executeScript(rude_element);
			await actions.move({ origin: clickable }).click().perform();
			await clickable.sendKeys(nome_do_deck);
			await clickable.sendKeys(Key.ENTER);
			console.log(
				`A opção "${nome_do_deck}" foi selecionada com sucesso.\n\r\r`,
			);
		}
	} catch (e) {
		throw new Error(`O selectDropdown falhou !!!${e}`);
	}
}
