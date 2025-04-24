import Button from "../../../../../components/bootstrap/Button";
import FormGroup from "../../../../../components/bootstrap/forms/FormGroup";
import Input from "../../../../../components/bootstrap/forms/Input";

export default function SendFunction({ formik, setFinish }: { formik: any, setFinish:any }) {
	return (
		<div className='d-flex flex-column'>
			<p className='text-muted text-start'>
				Para continuar escreva a função da vaga que você deseja abrir
			</p>
			<FormGroup className='w-100' id='function' label='Função' isFloating>
				<Input
					className='text-capitalize'
					placeholder='Função'
					onChange={formik.handleChange}
					onBlur={formik.handleBlur}
					value={formik.values.function}
					isValid={formik.isValid}
					isTouched={formik.touched.function}
					invalidFeedback={formik.errors.function}
					validFeedback='Ótimo!'
				/>
			</FormGroup>
			<div className='d-flex justify-content-end mt-4'>
				<Button
					isLight
					color='primary'
					onClick={() => {
                        if (formik.values.function.trim().length > 0) {
                            setFinish(true);
                        } else {
                            // opcional: forçar validação visual
                            formik.setFieldTouched('function', true);
                        }
					}}>
					Continuar
				</Button>
			</div>
		</div>
	);
}
