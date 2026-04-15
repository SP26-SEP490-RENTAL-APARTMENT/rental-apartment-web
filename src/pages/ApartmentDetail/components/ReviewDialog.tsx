import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

function ReviewDialog() {
  return (
    <Dialog open={true}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>
                    Đánh giá dịch vụ của chúng tôi
                </DialogTitle>
            </DialogHeader>
            <div>hello</div>
        </DialogContent>
    </Dialog>
  )
}

export default ReviewDialog