import { updateSituation } from 'Actions/actions'
import { ExplicableRule } from 'Components/conversation/Explicable'
import RuleInput from 'Components/conversation/RuleInput'
import Animate from 'Components/ui/animate'
import { EngineContext } from 'Components/utils/EngineContext'
import { useNextQuestions } from 'Components/utils/useNextQuestion'
import { DottedName } from 'modele-social'
import { RuleNode } from 'publicodes'
import { useCallback, useContext } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { situationSelector } from 'Selectors/simulationSelectors'
import { Question } from './index'

type SubSectionProp = {
	dottedName: DottedName
	hideTitle?: boolean
}
export function SubSection({
	dottedName: sectionDottedName,
	hideTitle = false,
}: SubSectionProp) {
	const engine = useContext(EngineContext)
	const ruleTitle = engine.getRule(sectionDottedName)?.title
	const nextSteps = useNextQuestions()
	const situation = useSelector(situationSelector)
	const title = hideTitle ? null : ruleTitle
	const subQuestions = [
		...(Object.keys(situation) as Array<DottedName>),
		...nextSteps,
	].filter((nextStep) => {
		const {
			dottedName,
			rawNode: { question },
		} = engine.getRule(nextStep)
		return !!question && dottedName.startsWith(sectionDottedName)
	})

	return (
		<>
			{!!subQuestions.length && title && <h3>{title}</h3>}
			{subQuestions.map((dottedName) => (
				<SimpleField key={dottedName} dottedName={dottedName} />
			))}
		</>
	)
}
type SimpleFieldProps = {
	dottedName: DottedName
	summary?: RuleNode['rawNode']['résumé']
	question?: RuleNode['rawNode']['question']
	showSuggestions?: boolean
}
export function SimpleField({
	dottedName,
	question,
	summary,
	showSuggestions,
}: SimpleFieldProps) {
	const dispatch = useDispatch()
	const engine = useContext(EngineContext)
	const evaluation = engine.evaluate(dottedName)
	const rule = engine.getRule(dottedName)
	const situation = useSelector(situationSelector)

	const dispatchValue = useCallback(
		(value, dottedName) => {
			dispatch(updateSituation(dottedName, value))
		},
		[dispatch]
	)

	if (
		!(dottedName in situation) &&
		evaluation.nodeValue === false &&
		!(dottedName in evaluation.missingVariables)
	) {
		return null
	}
	return (
		<div
			css={`
				break-inside: avoid;
			`}
		>
			<Animate.fromTop>
				<Question>
					<div
						css={`
							border-left: 3px solid var(--lightColor);
							padding-left: 0.6rem;
						`}
					>
						<p>
							{question ?? rule.rawNode.question}&nbsp;
							<ExplicableRule dottedName={dottedName} />
						</p>
						<p className="ui__ notice">{summary ?? rule.rawNode.résumé}</p>
					</div>
					<RuleInput
						dottedName={dottedName}
						onChange={dispatchValue}
						showSuggestions={showSuggestions}
					/>
				</Question>
			</Animate.fromTop>
		</div>
	)
}
