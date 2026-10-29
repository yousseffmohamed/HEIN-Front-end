import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductsService } from '../../core/services/products-service';
import { IProduct } from '../../core/models/iproduct';
import { environment } from '../../environments/env';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-dashboard-products',
  imports: [ReactiveFormsModule, TitleCasePipe],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class DashboardProducts implements OnInit {
  private _productsService = inject(ProductsService);
  private _cdr = inject(ChangeDetectorRef);

  products: IProduct[] = [];
  isLoading = true;
  errorMessage = '';
  isSaving = false;
  staticURL = environment.staticURL;

  showProductModal = false;
  editingProductId: string | null = null;
  productModalTitle = 'Add New Product';

  selectedMainPicFile: File | null = null;
  mainPicPreview: string | null = null;
  selectedAdditionalFiles: File[] = [];
  additionalPreviews: string[] = [];

  productForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    price: new FormControl<number | null>(null, [Validators.required, Validators.min(1)]),
    stock: new FormControl<number | null>(null, [Validators.required, Validators.min(0)]),
    category: new FormControl('electronics', [Validators.required]),
    department: new FormControl('men', [Validators.required]),
    brand: new FormControl('', [Validators.required]),
    slug: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
  });

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this._productsService.getAllProducts().subscribe({
      next: (res) => {
        this.products = res.data || [];
        this.isLoading = false;
        this._cdr.detectChanges();
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = 'Failed to load products. Please check server connection.';
        this._cdr.detectChanges();
      },
    });
  }

  openAddProductModal(): void {
    this.editingProductId = null;
    this.productModalTitle = 'Add New Product';
    this.resetImageSelection();
    this.productForm.reset({
      category: 'electronics',
      department: 'men',
      stock: 10,
    });
    this.showProductModal = true;
  }

  openEditProductModal(product: IProduct): void {
    this.editingProductId = product._id;
    this.productModalTitle = 'Edit Product';
    this.resetImageSelection();

    if (product.mainPic) {
      this.mainPicPreview = this.staticURL + product.mainPic;
    }

    if (product.images && product.images.length) {
      this.additionalPreviews = product.images.map((img) => this.staticURL + img);
    }

    this.productForm.patchValue({
      name: product.name,
      price: product.price,
      stock: product.stock,
      category: product.category && product.category.length ? product.category[0] : 'electronics',
      department: product.department || 'men',
      brand: product.brand || '',
      slug: product.slug,
      description: product.description,
    });
    this.showProductModal = true;
  }

  closeProductModal(): void {
    this.showProductModal = false;
    this.editingProductId = null;
    this.resetImageSelection();
  }

  resetImageSelection(): void {
    this.selectedMainPicFile = null;
    this.mainPicPreview = null;
    this.selectedAdditionalFiles = [];
    this.additionalPreviews = [];
  }

  onMainPicSelected(event: any): void {
    const file = event.target.files?.[0];
    if (file) {
      this.selectedMainPicFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.mainPicPreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  removeMainPic(): void {
    this.selectedMainPicFile = null;
    this.mainPicPreview = null;
  }

  onAdditionalPicsSelected(event: any): void {
    const files: FileList = event.target.files;
    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        this.selectedAdditionalFiles.push(file);
        const reader = new FileReader();
        reader.onload = () => {
          this.additionalPreviews.push(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  }

  removeAdditionalPic(index: number): void {
    this.selectedAdditionalFiles.splice(index, 1);
    this.additionalPreviews.splice(index, 1);
  }

  saveProduct(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    if (!this.editingProductId && !this.selectedMainPicFile) {
      alert("Product's main image is required");
      return;
    }

    this.isSaving = true;
    const formData = new FormData();
    formData.append('name', this.productForm.value.name || '');
    formData.append('price', String(this.productForm.value.price || 0));
    formData.append('stock', String(this.productForm.value.stock ?? 0));
    formData.append('category', this.productForm.value.category || 'electronics');
    formData.append('department', this.productForm.value.department || 'men');
    formData.append('brand', this.productForm.value.brand || '');
    formData.append('slug', this.productForm.value.slug || '');
    formData.append('description', this.productForm.value.description || '');

    if (this.selectedMainPicFile) {
      formData.append('mainPic', this.selectedMainPicFile);
    }

    for (const file of this.selectedAdditionalFiles) {
      formData.append('images', file);
    }

    if (this.editingProductId) {
      this._productsService.updateProduct(this.editingProductId, formData).subscribe({
        next: (res) => {
          this.isSaving = false;
          const index = this.products.findIndex((p) => p._id === this.editingProductId);
          if (index > -1 && res.data) {
            this.products[index] = res.data;
          }
          this.closeProductModal();
          this._cdr.detectChanges();
        },
        error: (err) => {
          this.isSaving = false;
          alert(err.error?.message || err.error?.error || 'Failed to update product');
          this._cdr.detectChanges();
        },
      });
    } else {
      this._productsService.addProduct(formData).subscribe({
        next: (res) => {
          this.isSaving = false;
          if (res.data) {
            this.products.unshift(res.data);
          }
          this.closeProductModal();
          this._cdr.detectChanges();
        },
        error: (err) => {
          this.isSaving = false;
          alert(err.error?.message || err.error?.error || 'Failed to add product');
          this._cdr.detectChanges();
        },
      });
    }
  }

  deleteProduct(productId: string): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this._productsService.deleteProduct(productId).subscribe({
        next: () => {
          this.products = this.products.filter((p) => p._id !== productId);
          this._cdr.detectChanges();
        },
        error: () => {
          this.products = this.products.filter((p) => p._id !== productId);
          this._cdr.detectChanges();
        },
      });
    }
  }
}
